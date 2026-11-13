#!/usr/bin/env node
/**
 * 重新生成内置游戏数据 resources/game-data/seed.json。
 *
 * 用法：pnpm build:seed
 *
 * 数据从扩展运行时用的同一个 cnb 镜像下载，转换逻辑直接复用
 * src/backend/services/game-data-update.ts 的 buildGameDataSnapshot，
 * 所以内置数据和运行时更新的快照结构、ETag 规则完全一致。
 */
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const seedPath = path.join(root, 'resources', 'game-data', 'seed.json');
const entry = path.join(root, 'src', 'backend', 'services', 'game-data-update.ts');

const HEAD_TIMEOUT = 30_000;
const DOWNLOAD_TIMEOUT = 180_000;

const FILES = {
    monsters: 'unity/monsters.json',
    moves: 'unity/moves.json',
    mintmarks: 'unity/mintmark.json',
    petbook: 'unity/petbook.json',
};

const PATCH_FILE = 'patches/moves.json';

/** 把 TS 服务打包成 CJS 载入；vscode 模块在脚本里用空对象顶替。 */
async function loadGameDataService() {
    const bundled = await build({
        entryPoints: [entry],
        bundle: true,
        platform: 'node',
        format: 'cjs',
        write: false,
        logLevel: 'silent',
        plugins: [
            {
                name: 'vscode-stub',
                setup(builder) {
                    builder.onResolve({ filter: /^vscode$/ }, () => ({ path: 'vscode', namespace: 'stub' }));
                    builder.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({
                        contents: 'module.exports = {};',
                        loader: 'js',
                    }));
                },
            },
        ],
    });

    const bundlePath = path.join(os.tmpdir(), `xm-seed-${process.pid}-${Date.now()}.cjs`);
    await fs.writeFile(bundlePath, bundled.outputFiles[0].text);
    try {
        return require(bundlePath);
    } finally {
        await fs.rm(bundlePath, { force: true });
    }
}

async function headEtag(url) {
    const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(HEAD_TIMEOUT) });
    if (!response.ok) {
        throw new Error(`HEAD ${url} 返回 ${response.status}`);
    }
    const etag = response.headers.get('etag');
    if (!etag) {
        throw new Error(`${url} 没有返回 ETag，无法作为版本号`);
    }
    return etag;
}

async function getJson(url) {
    const response = await fetch(url, { signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT) });
    if (!response.ok) {
        throw new Error(`GET ${url} 返回 ${response.status}`);
    }
    return response.json();
}

async function readOldSeed() {
    try {
        return JSON.parse(await fs.readFile(seedPath, 'utf8'));
    } catch {
        return undefined;
    }
}

/** 五个文件的 ETag 全部一致时说明远端数据没变。 */
function sameEtags(before, after) {
    if (!before) {
        return false;
    }
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    return [...keys].every((key) => before[key] === after[key]);
}

function describeChanges(oldSeed, snapshot) {
    if (!oldSeed) {
        return ['  之前没有内置数据，这是第一次生成'];
    }
    const lines = [];
    const diff = (label, before, after) =>
        before === after ? `${label} ${after}` : `${label} ${before} → ${after}`;
    lines.push('  ' + diff('精灵', oldSeed.monsters?.length ?? 0, snapshot.monsters.length));
    lines.push('  ' + diff('刻印', oldSeed.mintmarks?.length ?? 0, snapshot.mintmarks.length));
    lines.push('  ' + diff('技能', Object.keys(oldSeed.skills ?? {}).length, Object.keys(snapshot.skills).length));
    const before = oldSeed.check?.etags ?? {};
    const changed = Object.keys(snapshot.check.etags).filter((key) => before[key] !== snapshot.check.etags[key]);
    lines.push(changed.length ? `  ETag 变化的文件：${changed.join(', ')}` : '  ETag 未变化');
    return lines;
}

async function main() {
    const { buildGameDataSnapshot, GAME_DATA_SOURCES: sources } = await loadGameDataService();
    const oldSeed = await readOldSeed();
    const force = process.argv.includes('--force');

    console.log('检查数据版本…');
    const etags = {};
    for (const [key, file] of Object.entries(FILES)) {
        etags[key] = await headEtag(`${sources.config}/${file}`);
    }
    etags.patch = await headEtag(`${sources.patch}/${PATCH_FILE}`);

    // 数据没变就不重新下载、不改 updatedAt，避免为同样的数据生成一次无意义的改动。
    if (!force && oldSeed && sameEtags(oldSeed.check?.etags, etags)) {
        console.log('\n内置数据已是最新（ETag 未变化），跳过下载。');
        console.log(
            `  精灵 ${oldSeed.monsters?.length ?? 0} / 刻印 ${oldSeed.mintmarks?.length ?? 0} / ` +
                `技能 ${Object.keys(oldSeed.skills ?? {}).length}`
        );
        console.log('  需要按当前代码重新生成时：pnpm run build:seed -- --force');
        return;
    }

    console.log('下载数据文件…');
    const raw = {};
    for (const [key, file] of Object.entries(FILES)) {
        raw[key] = await getJson(`${sources.config}/${file}`);
        console.log(`  ${key}`);
    }
    const patch = await getJson(`${sources.patch}/${PATCH_FILE}`);
    console.log(`  patch（${Array.isArray(patch.content) ? patch.content.length : 0} 条）`);

    const snapshot = buildGameDataSnapshot(raw, patch);
    snapshot.check = { host: sources.config, etags };

    const tempPath = `${seedPath}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(snapshot));
    await fs.rename(tempPath, seedPath);

    const size = (Buffer.byteLength(JSON.stringify(snapshot)) / 1048576).toFixed(2);
    console.log(`\n已写入 ${path.relative(root, seedPath)}（${size}MB）`);
    for (const line of describeChanges(oldSeed, snapshot)) {
        console.log(line);
    }
}

main().catch((error) => {
    console.error('\n更新内置数据失败：' + (error instanceof Error ? error.message : String(error)));
    console.error('内置 seed 未改动。');
    process.exit(1);
});
