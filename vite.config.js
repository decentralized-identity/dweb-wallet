import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/**@ts-expect-error */
import nodePolyfills from 'vite-plugin-node-stdlib-browser';
// https://vitejs.dev/config/
export default defineConfig({
    define: {
        global: "globalThis",
    },
    plugins: [
        react(),
        nodePolyfills(),
        VitePWA({
            strategies: 'injectManifest',
            srcDir: 'src',
            filename: "sw.ts",
            registerType: 'autoUpdate',
            injectRegister: false,
            pwaAssets: {
                disabled: false,
                config: true,
            },
            manifest: {
                name: 'DWebWallet',
                short_name: 'DWebWallet',
                description: 'Decentralized identity manager',
                theme_color: '#E03A3E',
            },
            injectManifest: {
                globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
                globIgnores: [
                    'assets/icons/**'
                ],
                maximumFileSizeToCacheInBytes: 1024 * 1024 * 5,
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,svg,png,svg,ico}'],
                cleanupOutdatedCaches: true,
                clientsClaim: true
            },
            devOptions: {
                enabled: true,
                navigateFallback: 'index.html',
                suppressWarnings: true,
                type: 'module',
            }
        })
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
