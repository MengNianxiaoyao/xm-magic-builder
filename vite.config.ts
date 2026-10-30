import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    root: fileURLToPath(new URL('./src/frontend', import.meta.url)),
    plugins: [vue()],
    publicDir: false,
    build: {
        outDir: fileURLToPath(new URL('./dist/webview', import.meta.url)),
        emptyOutDir: true,
        target: 'es2021',
        sourcemap: true,
        cssCodeSplit: false,
        rollupOptions: {
            input: fileURLToPath(new URL('./src/frontend/main.ts', import.meta.url)),
            output: {
                format: 'iife',
                entryFileNames: 'main.js',
                chunkFileNames: '[name].js',
                assetFileNames: 'main.[ext]',
            },
        },
    },
});
