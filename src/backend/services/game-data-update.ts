import * as vscode from 'vscode';
import type { GameDataInfo } from '../../shared/messages';
import { getGameDataInfo, getSeedCheckState, invalidateGameDataCache, snapshotUri } from './game-data';
import type { GameDataSnapshot } from './game-data';

interface RawSkillRef {
    id: number;
}

interface RawMoveList {
    move?: RawSkillRef[];
    sp_move?: RawSkillRef[];
    adv_move?: RawSkillRef[];
}

interface RawPet {
    id: number;
    def_name: string;
    pet_class: number;
    real_id: number;
    learnable_moves?: RawMoveList;
    extra_moves?: RawMoveList | null;
    sp_extra_moves?: RawMoveList | null;
    show_extra_moves?: RawMoveList | null;
    move?: RawSkillRef | null;
}

interface RawMonstersFile {
    monsters: { monster: RawPet[] };
}

interface RawPetBookFile {
    root: { monster: { id: number }[] };
}

interface RawMovesFile {
    root: { moves: { move: { id: number; name: string }[] } };
}

interface RawMintmark {
    id: number;
    des: string;
    effect_des?: string;
    hide?: number;
    type?: number;
    mintmark_class?: number;
}

interface RawMintmarksFile {
    mint_marks: {
        mint_mark: RawMintmark[];
        mintmark_class?: { id: number; class_name: string }[];
    };
}

interface RawFiles {
    monsters: RawMonstersFile;
    moves: RawMovesFile;
    mintmarks: RawMintmarksFile;
    petbook: RawPetBookFile;
}

interface MovePatch {
    target?: string;
    mode?: string;
    content?: { id?: number; name?: string }[];
}

interface CheckState {
    at: number;
    host: string;
    etags: Record<string, string>;
}

export type GameDataUpdateStatus = 'checking' | 'downloading' | 'latest' | 'updated' | 'error';
export type GameDataStatusListener = (state: GameDataUpdateStatus, message?: string) => void;

export interface GameDataUpdateResult {
    info: GameDataInfo;
    updated: boolean;
}

const CNB_BASE = 'https://cnb.cool/mengnianxiaoyao';
const CNB_CONFIG = `${CNB_BASE}/seer-config-sources/-/git/raw/main`;
/** 补丁放同一个仓库的独立分支：同步流水线只重写 main，不会动这个分支。 */
const CNB_PATCH = `${CNB_BASE}/seer-config-sources/-/git/raw/patch-sources`;

/** 数据地址同时给 scripts/build-seed.mjs 用，避免脚本里再抄一份。 */
export const GAME_DATA_SOURCES = { config: CNB_CONFIG, patch: CNB_PATCH };

/**
 * 唯一的镜像：cnb.cool 每 6 小时从 GitHub 同步一次，ETag 是内容哈希，可直接判断数据是否变化。
 * 检查状态里记录的 host 就是 CNB_CONFIG。
 */
const configUrl = (path: string): string => `${CNB_CONFIG}/${path}`;
const patchUrl = (path: string): string => `${CNB_PATCH}/${path}`;

const FILES = [
    { key: 'monsters', path: 'unity/monsters.json' },
    { key: 'moves', path: 'unity/moves.json' },
    { key: 'mintmarks', path: 'unity/mintmark.json' },
    { key: 'petbook', path: 'unity/petbook.json' },
] as const;

const DATA_ITEMS = FILES.map((file) => ({ key: file.key, path: file.path, url: () => configUrl(file.path) }));

/** 补丁是可选文件：镜像里没有它时不影响数据文件的检查与下载。 */
const PATCH_ITEM = { key: 'patch', path: 'patches/moves.json', url: () => patchUrl('patches/moves.json') };

const CHECK_ITEMS = [...DATA_ITEMS, PATCH_ITEM];

const CHECK_INTERVAL = 24 * 60 * 60 * 1000;
const CHECK_FAILURE_BACKOFF = 10 * 60 * 1000;
const CHECK_STATE_KEY = 'gameData.check';
const CHECK_FAILED_KEY = 'gameData.checkFailedAt';
const TOTAL_UPDATE_TIMEOUT = 120_000;
const DOWNLOAD_TIMEOUT = 60_000;
const PATCH_TIMEOUT = 10_000;
const HEAD_TIMEOUT = 10_000;
const USER_AGENT = 'xm-magic-builder';

const listeners = new Set<(info: GameDataInfo) => void>();
let currentUpdate: Promise<GameDataUpdateResult> | undefined;

export function onGameDataUpdated(listener: (info: GameDataInfo) => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function checkAndUpdateGameData(
    context: vscode.ExtensionContext,
    options: { force?: boolean; onStatus?: GameDataStatusListener } = {}
): Promise<GameDataUpdateResult> {
    if (currentUpdate) {
        return currentUpdate;
    }
    currentUpdate = runUpdate(context, options).finally(() => {
        currentUpdate = undefined;
    });
    return currentUpdate;
}

async function runUpdate(
    context: vscode.ExtensionContext,
    options: { force?: boolean; onStatus?: GameDataStatusListener }
): Promise<GameDataUpdateResult> {
    const force = options.force === true;
    const info = await getGameDataInfo(context);

    if (!force && !autoUpdateEnabled()) {
        return { info, updated: false };
    }

    let state = readCheckState(context);
    const primaryComplete = Boolean(state && DATA_ITEMS.every((item) => state?.etags[item.key]));
    // 当前用的是内置数据时，以它自带的 ETag 为比较基准：远端没变就不用再下载一遍，
    // 否则会出现数据相同、只换个 updatedAt 的快照。
    if (info.source === 'bundled' || !primaryComplete) {
        const seedCheck = await getSeedCheckState(context);
        if (seedCheck) {
            const seedFirst = info.source === 'bundled';
            state = {
                at: seedFirst ? (state?.at ?? 0) : 0,
                host: CNB_CONFIG,
                etags: seedFirst
                    ? { ...(state?.etags ?? {}), ...seedCheck.etags }
                    : { ...seedCheck.etags, ...(state?.etags ?? {}) },
            };
        }
    }
    if (!force && state && Date.now() - state.at < CHECK_INTERVAL) {
        return { info, updated: false };
    }

    const failedAt = context.globalState.get<number>(CHECK_FAILED_KEY);
    if (!force && failedAt && Date.now() - failedAt < CHECK_FAILURE_BACKOFF) {
        return { info, updated: false };
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TOTAL_UPDATE_TIMEOUT);

    try {
        const result = await performUpdate(context, options, state, controller.signal);
        await context.globalState.update(CHECK_FAILED_KEY, undefined);
        return result;
    } catch (error) {
        await context.globalState.update(CHECK_FAILED_KEY, Date.now());
        throw error;
    } finally {
        clearTimeout(timer);
    }
}

async function performUpdate(
    context: vscode.ExtensionContext,
    options: { onStatus?: GameDataStatusListener },
    state: CheckState | undefined,
    signal: AbortSignal
): Promise<GameDataUpdateResult> {
    options.onStatus?.('checking');
    const checked = await checkRemote(state, signal);
    if (!checked) {
        throw new Error('所有数据镜像都不可用');
    }

    if (!checked.changed) {
        await saveCheckState(context, state, checked);
        options.onStatus?.('latest');
        return { info: await getGameDataInfo(context), updated: false };
    }

    options.onStatus?.('downloading');
    const files = await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: '下载游戏数据',
            cancellable: false,
        },
        (progress) => {
            let reported = 0;
            const report = (increment: number, message: string): void => {
                const step = Math.min(increment, Math.max(0, 100 - reported));
                reported += step;
                progress.report({ increment: step, message });
            };
            return downloadData(signal, report);
        }
    );
    const patch = await downloadPatch(signal);
    const snapshot = buildGameDataSnapshot(files, patch);
    await writeSnapshot(context, snapshot);

    invalidateGameDataCache();
    const info = await getGameDataInfo(context);
    await saveCheckState(context, state, checked);

    options.onStatus?.('updated');
    for (const listener of listeners) {
        listener(info);
    }
    return { info, updated: true };
}

function autoUpdateEnabled(): boolean {
    return vscode.workspace.getConfiguration('xm-magic-builder').get<boolean>('gameData.autoUpdate', true);
}

function readCheckState(context: vscode.ExtensionContext): CheckState | undefined {
    const raw = context.globalState.get<unknown>(CHECK_STATE_KEY);
    if (!raw || typeof raw !== 'object') {
        return undefined;
    }
    const value = raw as { at?: unknown; host?: unknown; etags?: unknown };
    if (value.host !== CNB_CONFIG || !value.etags || typeof value.etags !== 'object') {
        return undefined;
    }
    return {
        at: typeof value.at === 'number' ? value.at : 0,
        host: CNB_CONFIG,
        etags: value.etags as Record<string, string>,
    };
}

async function saveCheckState(
    context: vscode.ExtensionContext,
    state: CheckState | undefined,
    checked: { etags: Record<string, string> }
): Promise<void> {
    await context.globalState.update(CHECK_STATE_KEY, {
        at: Date.now(),
        host: CNB_CONFIG,
        etags: { ...(state?.etags ?? {}), ...checked.etags },
    } satisfies CheckState);
}

type HeadResult =
    | { ok: true; key: string; changed: boolean; etag?: string }
    | { ok: false; key: string; error: unknown };

interface CheckResult {
    changed: boolean;
    etags: Record<string, string>;
}

async function checkItem(
    item: (typeof CHECK_ITEMS)[number],
    state: CheckState | undefined,
    signal: AbortSignal
): Promise<HeadResult> {
    const cached = state?.etags[item.key];
    const headers: Record<string, string> = { 'User-Agent': USER_AGENT };
    if (cached) {
        headers['If-None-Match'] = cached;
    }

    try {
        const response = await fetch(item.url(), {
            method: 'HEAD',
            headers,
            signal: AbortSignal.any([signal, AbortSignal.timeout(HEAD_TIMEOUT)]),
        });

        if (response.status === 304) {
            return { ok: true, key: item.key, changed: false, etag: cached };
        }
        // 路径不存在时 cnb 会回落成网页，避免把网页的 ETag 当成数据版本。
        if (!response.ok || response.headers.get('content-type')?.includes('text/html')) {
            throw new Error(`HTTP ${response.status}`);
        }

        const etag = response.headers.get('etag') ?? undefined;
        const unchanged = Boolean(cached && etag && etag === cached);
        if (!unchanged && cached) {
            console.log(`[数据查询] ${item.path} ETag 变化，需要更新`);
        }
        return { ok: true, key: item.key, changed: !unchanged, etag };
    } catch (error) {
        return { ok: false, key: item.key, error };
    }
}

/** 5 个文件并发探测，整轮耗时由最慢的一个决定；ETag 是内容哈希，直接决定要不要重建快照。 */
async function checkRemote(state: CheckState | undefined, signal: AbortSignal): Promise<CheckResult | undefined> {
    const results = await Promise.all(CHECK_ITEMS.map((item) => checkItem(item, state, signal)));

    const dataFailed = results.find(
        (result): result is Extract<HeadResult, { ok: false }> =>
            !result.ok && DATA_ITEMS.some((item) => item.key === result.key)
    );
    if (dataFailed) {
        console.info(
            `[数据查询] 数据镜像不可用：${CNB_CONFIG}`,
            dataFailed.error instanceof Error ? dataFailed.error.message : String(dataFailed.error)
        );
        return undefined;
    }

    const etags: Record<string, string> = {};
    let changed = false;
    for (const result of results) {
        // 补丁探测失败不影响数据更新，旧 ETag 会保留。
        if (!result.ok) {
            console.warn(
                `[数据查询] 补丁检查失败：${result.key}`,
                result.error instanceof Error ? result.error.message : String(result.error)
            );
            continue;
        }
        if (result.etag) {
            etags[result.key] = result.etag;
        }
        if (result.changed) {
            changed = true;
        }
    }

    return { changed, etags };
}

type DownloadProgress = (increment: number, message: string) => void;

async function downloadData(signal: AbortSignal, onProgress: DownloadProgress): Promise<RawFiles> {
    onProgress(0, '准备下载…');
    const monsters = await fetchJson<RawMonstersFile>(configUrl('unity/monsters.json'), signal, DOWNLOAD_TIMEOUT);
    onProgress(25, '精灵数据 (1/4)');
    const moves = await fetchJson<RawMovesFile>(configUrl('unity/moves.json'), signal, DOWNLOAD_TIMEOUT);
    onProgress(25, '技能数据 (2/4)');
    const mintmarks = await fetchJson<RawMintmarksFile>(configUrl('unity/mintmark.json'), signal, DOWNLOAD_TIMEOUT);
    onProgress(25, '刻印数据 (3/4)');
    const petbook = await fetchJson<RawPetBookFile>(configUrl('unity/petbook.json'), signal, DOWNLOAD_TIMEOUT);
    onProgress(25, '图鉴数据 (4/4)');
    return { monsters, moves, mintmarks, petbook };
}

async function downloadPatch(signal: AbortSignal): Promise<MovePatch | undefined> {
    try {
        return await fetchJson<MovePatch>(patchUrl('patches/moves.json'), signal, PATCH_TIMEOUT);
    } catch (error) {
        console.warn('[数据查询] 补丁下载失败', error instanceof Error ? error.message : String(error));
        return undefined;
    }
}

async function fetchJson<T>(url: string, signal: AbortSignal, timeout: number): Promise<T> {
    const response = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.any([signal, AbortSignal.timeout(timeout)]),
    });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${url}`);
    }
    return JSON.parse(await response.text()) as T;
}

/** 把官方 Unity 数据转换成搜索用的紧凑快照；导出用于离线验证。 */
export function buildGameDataSnapshot(files: RawFiles, patch?: MovePatch): GameDataSnapshot {
    const skillNames = new Map<number, string>();
    for (const move of files.moves.root.moves.move) {
        skillNames.set(move.id, move.name);
    }

    if (patch?.target === 'moves.json' && patch.mode === 'append' && Array.isArray(patch.content)) {
        for (const move of patch.content) {
            if (typeof move.id === 'number' && typeof move.name === 'string' && !skillNames.has(move.id)) {
                skillNames.set(move.id, move.name);
            }
        }
    }

    const classNames = new Map<number, string>();
    for (const item of files.mintmarks.mint_marks.mintmark_class ?? []) {
        classNames.set(item.id, item.class_name);
    }

    const dexIds = new Set(files.petbook.root.monster.map((item) => item.id));
    const monsters: GameDataSnapshot['monsters'] = [];
    const usedSkills = new Set<number>();

    for (const pet of files.monsters.monsters.monster) {
        if (!dexIds.has(pet.id) || pet.real_id !== 0 || pet.pet_class <= 0) {
            continue;
        }

        const ids = new Set<number>();
        const add = (list?: RawSkillRef[]): void => {
            for (const item of list ?? []) {
                ids.add(item.id);
            }
        };
        add(pet.learnable_moves?.move);
        add(pet.learnable_moves?.sp_move);
        add(pet.learnable_moves?.adv_move);
        add(pet.extra_moves?.move);
        add(pet.sp_extra_moves?.move);
        add(pet.show_extra_moves?.move);
        if (pet.move) {
            ids.add(pet.move.id);
        }

        const skillIds = [...ids];
        for (const id of skillIds) {
            usedSkills.add(id);
        }
        monsters.push([pet.id, pet.def_name, skillIds]);
    }

    const skills: Record<string, string> = {};
    for (const id of usedSkills) {
        skills[String(id)] = skillNames.get(id) ?? '';
    }

    const mintmarks: GameDataSnapshot['mintmarks'] = [];
    for (const mintmark of files.mintmarks.mint_marks.mint_mark) {
        if (mintmark.hide === 1 || mintmark.type === 4) {
            continue;
        }
        const classId = mintmark.mintmark_class && mintmark.mintmark_class > 0 ? mintmark.mintmark_class : null;
        mintmarks.push([mintmark.id, mintmark.des, mintmark.effect_des ?? '', classId]);
    }

    const classes: Record<string, string> = {};
    for (const [id, name] of classNames) {
        classes[String(id)] = name;
    }

    if (monsters.length < 4000 || monsters.length > 6000) {
        throw new Error(`精灵数量异常：${monsters.length}`);
    }
    if (mintmarks.length < 3000 || mintmarks.length > 4500) {
        throw new Error(`刻印数量异常：${mintmarks.length}`);
    }
    if (usedSkills.size < 20000) {
        throw new Error(`技能数量异常：${usedSkills.size}`);
    }

    return {
        version: 1,
        source: 'SeerAPI/config-sources',
        updatedAt: new Date().toISOString(),
        skills,
        classes,
        monsters,
        mintmarks,
    };
}

async function writeSnapshot(context: vscode.ExtensionContext, snapshot: GameDataSnapshot): Promise<void> {
    const directory = vscode.Uri.joinPath(context.globalStorageUri, 'game-data');
    const target = snapshotUri(context);
    const data = Buffer.from(JSON.stringify(snapshot), 'utf8');
    const temp = vscode.Uri.joinPath(directory, 'snapshot.json.tmp');

    await vscode.workspace.fs.createDirectory(directory);
    await vscode.workspace.fs.writeFile(temp, data);

    try {
        await vscode.workspace.fs.rename(temp, target, { overwrite: true });
    } catch (error) {
        await vscode.workspace.fs.writeFile(target, data);
        try {
            await vscode.workspace.fs.delete(temp);
        } catch {
            // 临时文件清理失败不影响结果
        }
        console.warn('[数据查询] 快照原子替换失败，已直接写入', error);
    }
}
