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
    rawEtags?: Record<string, string>;
}

export type GameDataUpdateStatus = 'checking' | 'downloading' | 'latest' | 'updated' | 'error';
export type GameDataStatusListener = (state: GameDataUpdateStatus, message?: string) => void;

export interface GameDataUpdateResult {
    info: GameDataInfo;
    updated: boolean;
}

const RAW_CONFIG = 'https://raw.githubusercontent.com/SeerAPI/config-sources/main';
const RAW_PATCH = 'https://raw.githubusercontent.com/SeerAPI/patch-sources/main';
/** 国内可用的 GitHub 反向代理，返回的 ETag 与 raw 一致。 */
const EDGEONE_PROXY = 'https://edgeone.gh-proxy.com/';
/** 反代对未缓存的文件要先回源，冷启动明显慢于直连。 */
const EDGEONE_HEAD_TIMEOUT = 20_000;

/** jsDelivr 系镜像共用一套 ETag；raw 和它的代理共用另一套。 */
type EtagGroup = 'jsdelivr' | 'raw';

interface Mirror {
    /** 持久化到检查状态的标识。 */
    host: string;
    group: EtagGroup;
    configUrl: (path: string) => string;
    patchUrl: (path: string) => string;
    /** range：HEAD 不可靠的反代改用 1 字节 GET，顺带预热它的缓存。 */
    probe?: 'head' | 'range';
    /** 冷启动慢的反代需要更长超时。 */
    headTimeout?: number;
}

function baseMirror(
    host: string,
    group: EtagGroup,
    config: string,
    patch: string,
    extra: Partial<Mirror> = {}
): Mirror {
    return {
        host,
        group,
        configUrl: (path) => `${config}/${path}`,
        patchUrl: (path) => `${patch}/${path}`,
        ...extra,
    };
}

function jsdelivrMirror(subdomain: string): Mirror {
    return baseMirror(
        `https://${subdomain}.jsdelivr.net/gh/SeerAPI/config-sources@main`,
        'jsdelivr',
        `https://${subdomain}.jsdelivr.net/gh/SeerAPI/config-sources@main`,
        `https://${subdomain}.jsdelivr.net/gh/SeerAPI/patch-sources@main`
    );
}

const JS_DMIRROR = baseMirror(
    'https://cdn.jsdmirror.com/gh/SeerAPI/config-sources@main',
    'jsdelivr',
    'https://cdn.jsdmirror.com/gh/SeerAPI/config-sources@main',
    'https://cdn.jsdmirror.com/gh/SeerAPI/patch-sources@main'
);

/** gcore / cdn.jsdelivr.net 实测长期连不通，已从链路上删除。 */
const CHECK_MIRRORS: Mirror[] = [
    jsdelivrMirror('fastly'),
    baseMirror(RAW_CONFIG, 'raw', RAW_CONFIG, RAW_PATCH),
    baseMirror(
        `${EDGEONE_PROXY}${RAW_CONFIG}`,
        'raw',
        `${EDGEONE_PROXY}${RAW_CONFIG}`,
        `${EDGEONE_PROXY}${RAW_PATCH}`,
        {
            probe: 'range',
            headTimeout: EDGEONE_HEAD_TIMEOUT,
        }
    ),
];

const DOWNLOAD_MIRRORS: Mirror[] = [JS_DMIRROR, ...CHECK_MIRRORS];

const FILES = [
    { key: 'monsters', path: 'unity/monsters.json' },
    { key: 'moves', path: 'unity/moves.json' },
    { key: 'mintmarks', path: 'unity/mintmark.json' },
    { key: 'petbook', path: 'unity/petbook.json' },
] as const;

const CHECK_ITEMS = [
    ...FILES.map((file) => ({ key: file.key, path: file.path, url: (mirror: Mirror) => mirror.configUrl(file.path) })),
    { key: 'patch', path: 'patches/moves.json', url: (mirror: Mirror) => mirror.patchUrl('patches/moves.json') },
];

const CHECK_KEYS = CHECK_ITEMS.map((item) => item.key);

const CHECK_INTERVAL = 24 * 60 * 60 * 1000;
const CHECK_FAILURE_BACKOFF = 10 * 60 * 1000;
const CHECK_STATE_KEY = 'gameData.check';
const CHECK_FAILED_KEY = 'gameData.checkFailedAt';
const TOTAL_UPDATE_TIMEOUT = 120_000;
const DOWNLOAD_TIMEOUT = 60_000;
const PATCH_TIMEOUT = 10_000;
const HEAD_TIMEOUT = 5_000;
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

    if (!force && !autoUpdateEnabled()) {
        return { info: await getGameDataInfo(context), updated: false };
    }

    let state = readCheckState(context);
    const primaryEtags = state ? cachedEtags(state, state.host) : undefined;
    const primaryComplete = Boolean(
        state && mirrorOf(state.host) && primaryEtags && CHECK_KEYS.every((key) => primaryEtags?.[key])
    );
    const needSeed =
        !state || !primaryComplete || CHECK_KEYS.some((key) => !state?.etags?.[key] || !state?.rawEtags?.[key]);
    if (needSeed) {
        const seedCheck = await getSeedCheckState(context);
        if (seedCheck) {
            const etags = { ...seedCheck.etags, ...(state?.etags ?? {}) };
            const rawEtags = { ...(seedCheck.rawEtags ?? {}), ...(state?.rawEtags ?? {}) };
            const host = state && mirrorOf(state.host) ? state.host : seedCheck.host;
            state = {
                at: primaryComplete ? (state?.at ?? 0) : 0,
                host,
                etags,
                rawEtags,
            };
        }
    }
    if (!force && state && Date.now() - state.at < CHECK_INTERVAL) {
        return { info: await getGameDataInfo(context), updated: false };
    }

    const failedAt = context.globalState.get<number>(CHECK_FAILED_KEY);
    if (!force && failedAt && Date.now() - failedAt < CHECK_FAILURE_BACKOFF) {
        return { info: await getGameDataInfo(context), updated: false };
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
    const checked = await checkMirrors(state, signal);
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
            return downloadFromMirrors(checked.mirror, signal, report);
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

function mirrorOf(host: string): Mirror | undefined {
    return CHECK_MIRRORS.find((mirror) => mirror.host === host);
}

function etagGroupOf(host: string): EtagGroup {
    return mirrorOf(host)?.group ?? (host.includes('raw.githubusercontent.com') ? 'raw' : 'jsdelivr');
}

function cachedEtags(state: CheckState | undefined, host: string): Record<string, string> | undefined {
    if (!state) {
        return undefined;
    }
    return etagGroupOf(host) === 'raw' ? state.rawEtags : state.etags;
}

function readCheckState(context: vscode.ExtensionContext): CheckState | undefined {
    const raw = context.globalState.get<unknown>(CHECK_STATE_KEY);
    if (!raw || typeof raw !== 'object') {
        return undefined;
    }
    const value = raw as { at?: unknown; host?: unknown; etags?: unknown; rawEtags?: unknown };
    if (typeof value.host !== 'string' || !value.etags || typeof value.etags !== 'object') {
        return undefined;
    }
    const etags = value.etags as Record<string, string>;
    const rawEtags =
        value.rawEtags && typeof value.rawEtags === 'object' ? (value.rawEtags as Record<string, string>) : undefined;
    const at = typeof value.at === 'number' ? value.at : 0;
    if (!rawEtags && etagGroupOf(value.host) === 'raw') {
        return { at, host: value.host, etags: {}, rawEtags: etags };
    }
    return { at, host: value.host, etags, rawEtags };
}

async function saveCheckState(
    context: vscode.ExtensionContext,
    state: CheckState | undefined,
    checked: { mirror: Mirror; etags: Record<string, string> }
): Promise<void> {
    const etags = { ...(state?.etags ?? {}) };
    const rawEtags = { ...(state?.rawEtags ?? {}) };
    if (checked.mirror.group === 'raw') {
        Object.assign(rawEtags, checked.etags);
    } else {
        Object.assign(etags, checked.etags);
    }
    await context.globalState.update(CHECK_STATE_KEY, {
        at: Date.now(),
        host: checked.mirror.host,
        etags,
        rawEtags,
    } satisfies CheckState);
}

type HeadResult =
    | { ok: true; key: string; changed: boolean; etag?: string }
    | { ok: false; key: string; error: unknown };

interface CheckResult {
    mirror: Mirror;
    changed: boolean;
    etags: Record<string, string>;
}

async function checkItem(
    mirror: Mirror,
    item: (typeof CHECK_ITEMS)[number],
    state: CheckState | undefined,
    signal: AbortSignal
): Promise<HeadResult> {
    const cached = cachedEtags(state, mirror.host)?.[item.key];
    const headers: Record<string, string> = { 'User-Agent': USER_AGENT };
    if (cached) {
        headers['If-None-Match'] = cached;
    }
    const method = mirror.probe === 'range' ? 'GET' : 'HEAD';
    if (method === 'GET') {
        headers.Range = 'bytes=0-0';
    }
    // 反代第一次请求要回源，第二次就命中缓存，所以给它一次重试。
    const attempts = mirror.probe === 'range' ? 2 : 1;
    let lastError: unknown;

    for (let attempt = 0; attempt < attempts; attempt++) {
        try {
            const response = await fetch(item.url(mirror), {
                method,
                headers,
                signal: AbortSignal.any([signal, AbortSignal.timeout(mirror.headTimeout ?? HEAD_TIMEOUT)]),
            });

            if (response.status === 304) {
                await response.body?.cancel();
                return { ok: true, key: item.key, changed: false, etag: cached };
            }
            if (!response.ok) {
                await response.body?.cancel();
                throw new Error(`HTTP ${response.status}`);
            }

            const etag = response.headers.get('etag') ?? undefined;
            await response.body?.cancel();

            const unchanged = Boolean(cached && etag && etag === cached);
            if (!unchanged && cached) {
                console.log(`[数据查询] ${mirror.host} ${item.path} ETag 变化，需要更新`);
            }
            return { ok: true, key: item.key, changed: !unchanged, etag };
        } catch (error) {
            lastError = error;
            // 只有超时才说明可能是在回源，重试一次就能命中缓存；连不通就直接放弃。
            if (error instanceof Error && error.name !== 'TimeoutError') {
                break;
            }
        }
    }

    return { ok: false, key: item.key, error: lastError };
}

/** 5 个文件并发探测，整轮耗时由最慢的一个决定；ETag 按分组缓存，超时不会再误判为有更新。 */
async function checkMirrors(state: CheckState | undefined, signal: AbortSignal): Promise<CheckResult | undefined> {
    const mirrors = [...CHECK_MIRRORS];
    if (state?.host) {
        const index = mirrors.findIndex((mirror) => mirror.host === state.host);
        if (index > 0) {
            const [preferred] = mirrors.splice(index, 1);
            mirrors.unshift(preferred);
        }
    }

    for (const mirror of mirrors) {
        const results = await Promise.all(CHECK_ITEMS.map((item) => checkItem(mirror, item, state, signal)));

        const failed = results.find((result): result is Extract<HeadResult, { ok: false }> => !result.ok);
        if (failed) {
            console.info(
                `[数据查询] 镜像不可用，尝试下一个：${mirror.host}`,
                failed.error instanceof Error ? failed.error.message : String(failed.error)
            );
            continue;
        }

        const etags: Record<string, string> = {};
        let changed = false;
        for (const result of results) {
            if (!result.ok) {
                continue;
            }
            if (result.etag) {
                etags[result.key] = result.etag;
            }
            if (result.changed) {
                changed = true;
            }
        }

        return { mirror, changed, etags };
    }

    return undefined;
}

type DownloadProgress = (increment: number, message: string) => void;

async function downloadFromMirrors(
    preferred: Mirror,
    signal: AbortSignal,
    onProgress: DownloadProgress
): Promise<RawFiles> {
    const mirrors = [JS_DMIRROR, preferred, ...DOWNLOAD_MIRRORS];
    const seen = new Set<string>();
    let lastError: unknown;

    for (const mirror of mirrors) {
        if (seen.has(mirror.host)) {
            continue;
        }
        seen.add(mirror.host);

        try {
            onProgress(0, '准备下载…');
            const monsters = await fetchJson<RawMonstersFile>(
                mirror.configUrl('unity/monsters.json'),
                signal,
                DOWNLOAD_TIMEOUT
            );
            onProgress(25, '精灵数据 (1/4)');
            const moves = await fetchJson<RawMovesFile>(mirror.configUrl('unity/moves.json'), signal, DOWNLOAD_TIMEOUT);
            onProgress(25, '技能数据 (2/4)');
            const mintmarks = await fetchJson<RawMintmarksFile>(
                mirror.configUrl('unity/mintmark.json'),
                signal,
                DOWNLOAD_TIMEOUT
            );
            onProgress(25, '刻印数据 (3/4)');
            const petbook = await fetchJson<RawPetBookFile>(
                mirror.configUrl('unity/petbook.json'),
                signal,
                DOWNLOAD_TIMEOUT
            );
            onProgress(25, '图鉴数据 (4/4)');
            return { monsters, moves, mintmarks, petbook };
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError instanceof Error ? lastError : new Error('下载游戏数据失败');
}

const PATCH_URLS = [...new Set(DOWNLOAD_MIRRORS.map((mirror) => mirror.patchUrl('patches/moves.json')))];

async function downloadPatch(signal: AbortSignal): Promise<MovePatch | undefined> {
    for (const url of PATCH_URLS) {
        try {
            return await fetchJson<MovePatch>(url, signal, PATCH_TIMEOUT);
        } catch (error) {
            console.warn('[数据查询] 补丁下载失败', error instanceof Error ? error.message : String(error));
        }
    }
    return undefined;
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
