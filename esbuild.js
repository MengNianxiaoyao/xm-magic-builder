const esbuild = require('esbuild');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

const esbuildProblemMatcherPlugin = {
    name: 'esbuild-problem-matcher',
    setup(build) {
        build.onStart(() => {
            console.log('[esbuild] build started');
        });
        build.onEnd((result) => {
            const errors = result.errors || [];
            const warnings = result.warnings || [];
            for (const { text, location } of errors) {
                console.error(`[esbuild] ERROR: ${text}`);
                if (location) {
                    console.error(`    at ${location.file}:${location.line}:${location.column}`);
                }
            }
            for (const { text, location } of warnings) {
                console.warn(`[esbuild] WARN: ${text}`);
                if (location) {
                    console.warn(`    at ${location.file}:${location.line}:${location.column}`);
                }
            }
            console.log('[esbuild] build finished');
        });
    },
};

async function main() {
    const ctx = await esbuild.context({
        entryPoints: ['src/extension.ts'],
        bundle: true,
        format: 'cjs',
        platform: 'node',
        target: 'node16',
        outfile: 'dist/extension.js',
        external: ['vscode'],
        minify: production,
        drop: production ? ['console', 'debugger'] : undefined,
        sourcemap: !production,
        sourcesContent: false,
        logLevel: 'info',
        plugins: [esbuildProblemMatcherPlugin],
    });
    if (watch) {
        await ctx.watch();
    } else {
        await ctx.rebuild();
        await ctx.dispose();
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
