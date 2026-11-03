import * as vscode from 'vscode';
import type { GameDataInfo, GameDataType, GameMoveSummary, GameSearchPayload } from '../../shared/messages';

interface IndexedMonster {
    id: number;
    name: string;
    lower: string;
    moves: GameMoveSummary[];
}

interface IndexedMintmark {
    id: number;
    name: string;
    lower: string;
    effect: string;
    series: { id: number; name: string } | null;
}

interface GameDataIndex {
    monsters: IndexedMonster[];
    mintmarks: IndexedMintmark[];
}

/** 从官方 Unity 数据转换而来的紧凑快照；更新快照存放于 globalStorage，内置种子随扩展发布。 */
export interface GameDataSnapshot {
    version: 1;
    source: string;
    updatedAt: string;
    skills: Record<string, string>;
    classes: Record<string, string>;
    monsters: [number, string, number[]][];
    mintmarks: [number, string, string, number | null][];
    /** 仅内置 seed 使用：记录生成时各镜像的 ETag，首次检查时可直接判定为最新。 */
    check?: { host: string; etags: Record<string, string>; rawEtags?: Record<string, string> };
}

const RESULT_LIMIT = 50;

/** 旧快照可能包含 Type 4 碎片（小/中/大碎片），加载时排除。 */
const DEPRECATED_MINTMARK_IDS = new Set([50001, 50002, 50003]);

let indexPromise: Promise<GameDataIndex> | undefined;
let currentSource: GameDataInfo['source'] = 'bundled';
let currentUpdatedAt: string | undefined;

export function loadGameData(context: vscode.ExtensionContext): Promise<GameDataIndex> {
    indexPromise ??= loadIndex(context).catch((error: unknown) => {
        indexPromise = undefined;
        throw error;
    });
    return indexPromise;
}

export async function getGameDataInfo(context: vscode.ExtensionContext): Promise<GameDataInfo> {
    const index = await loadGameData(context);
    return {
        source: currentSource,
        updatedAt: currentUpdatedAt,
        monsters: index.monsters.length,
        mintmarks: index.mintmarks.length,
    };
}

/** 更新快照后调用，让下一次搜索重新加载。 */
export function invalidateGameDataCache(): void {
    indexPromise = undefined;
    currentSource = 'bundled';
    currentUpdatedAt = undefined;
}

export function snapshotUri(context: vscode.ExtensionContext): vscode.Uri {
    return vscode.Uri.joinPath(context.globalStorageUri, 'game-data', 'snapshot.json');
}

export async function getSeedCheckState(
    context: vscode.ExtensionContext
): Promise<{ host: string; etags: Record<string, string>; rawEtags?: Record<string, string> } | undefined> {
    const seed = await readSnapshotFile(seedUri(context), '读取内置数据失败');
    const check = seed?.check;
    if (!check) {
        return undefined;
    }
    if (check.host.includes('raw.githubusercontent.com')) {
        return { host: check.host, etags: {}, rawEtags: check.etags };
    }
    return check;
}

function seedUri(context: vscode.ExtensionContext): vscode.Uri {
    return vscode.Uri.joinPath(context.extensionUri, 'resources', 'game-data', 'seed.json');
}

async function loadIndex(context: vscode.ExtensionContext): Promise<GameDataIndex> {
    const snapshot = await readSnapshotFile(snapshotUri(context), '读取更新快照失败，改用内置数据');
    if (snapshot) {
        currentSource = 'snapshot';
        currentUpdatedAt = snapshot.updatedAt;
        return snapshotToIndex(snapshot);
    }

    const seed = await readSnapshotFile(seedUri(context), '读取内置数据失败');
    if (seed) {
        currentSource = 'bundled';
        currentUpdatedAt = seed.updatedAt;
        return snapshotToIndex(seed);
    }

    currentSource = 'bundled';
    currentUpdatedAt = undefined;
    throw new Error('缺少内置游戏数据（seed.json）');
}

export async function searchGameData(
    context: vscode.ExtensionContext,
    kind: GameDataType,
    query: string
): Promise<GameSearchPayload> {
    const index = await loadGameData(context);
    const text = query.trim();
    if (!text) {
        return { total: 0, monsters: [], mintmarks: [] };
    }

    const numeric = /^\d+$/.test(text) ? Number(text) : undefined;
    const lower = text.toLowerCase();

    if (kind === 'mintmark') {
        const matched = index.mintmarks.filter((item) =>
            numeric === undefined ? item.lower.includes(lower) : item.id === numeric
        );
        return {
            total: matched.length,
            monsters: [],
            mintmarks: matched.slice(0, RESULT_LIMIT).map((item) => ({
                id: item.id,
                name: item.name,
                effect: item.effect,
                series: item.series,
            })),
        };
    }

    const matched = index.monsters.filter((item) =>
        numeric === undefined ? item.lower.includes(lower) : item.id === numeric
    );
    return {
        total: matched.length,
        monsters: matched.slice(0, RESULT_LIMIT).map((item) => ({ id: item.id, name: item.name, moves: item.moves })),
        mintmarks: [],
    };
}

async function readSnapshotFile(uri: vscode.Uri, errorLabel: string): Promise<GameDataSnapshot | undefined> {
    try {
        const bytes = await vscode.workspace.fs.readFile(uri);
        const data = JSON.parse(new TextDecoder().decode(bytes)) as unknown;
        if (!isValidSnapshot(data)) {
            console.warn(`[数据查询] ${errorLabel}：快照格式无效`);
            return undefined;
        }
        return data;
    } catch (error) {
        const code = (error as { code?: string }).code;
        if (code !== 'FileNotFound') {
            console.error(`[数据查询] ${errorLabel}`, error);
        }
        return undefined;
    }
}

function isValidSnapshot(value: unknown): value is GameDataSnapshot {
    if (!value || typeof value !== 'object') {
        return false;
    }
    const snapshot = value as Partial<GameDataSnapshot>;
    if (
        snapshot.version !== 1 ||
        typeof snapshot.updatedAt !== 'string' ||
        !snapshot.skills ||
        !snapshot.classes ||
        !Array.isArray(snapshot.monsters) ||
        !Array.isArray(snapshot.mintmarks)
    ) {
        return false;
    }

    if (
        snapshot.check &&
        (typeof snapshot.check.host !== 'string' ||
            !snapshot.check.etags ||
            typeof snapshot.check.etags !== 'object' ||
            (snapshot.check.rawEtags && typeof snapshot.check.rawEtags !== 'object'))
    ) {
        return false;
    }

    return (
        snapshot.monsters.every(
            (item) =>
                Array.isArray(item) &&
                item.length === 3 &&
                typeof item[0] === 'number' &&
                typeof item[1] === 'string' &&
                Array.isArray(item[2])
        ) &&
        snapshot.mintmarks.every(
            (item) =>
                Array.isArray(item) &&
                item.length === 4 &&
                typeof item[0] === 'number' &&
                typeof item[1] === 'string' &&
                typeof item[2] === 'string' &&
                (item[3] === null || typeof item[3] === 'number')
        )
    );
}

function snapshotToIndex(snapshot: GameDataSnapshot): GameDataIndex {
    return {
        monsters: snapshot.monsters.map(([id, name, moveIds]) => ({
            id,
            name,
            lower: name.toLowerCase(),
            moves: moveIds.map((skillId) => ({ id: skillId, name: snapshot.skills[String(skillId)] ?? '未知技能' })),
        })),
        mintmarks: snapshot.mintmarks
            .filter(([id]) => !DEPRECATED_MINTMARK_IDS.has(id))
            .map(([id, name, effect, classId]) => ({
                id,
                name,
                lower: name.toLowerCase(),
                effect,
                series:
                    classId === null ? null : { id: classId, name: snapshot.classes[String(classId)] ?? '未知系列' },
            })),
    };
}
