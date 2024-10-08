import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';
// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    define: {
        global: "globalThis",
    },
    plugins: [
        svgr(),
        react(),
        nodePolyfills(),
        VitePWA({
            devOptions: {
                enabled: true,
                navigateFallback: 'index.html',
                type: 'module'
            },
            registerType: 'prompt',
            injectRegister: 'auto',
            includeAssets: ['favicon.ico', 'logo.png', 'index.html'],
            strategies: 'injectManifest',
            srcDir: 'src',
            filename: "sw.ts",
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
            manifestFilename: 'manifest.json',
            workbox: {
                navigateFallback: 'index.html',
                globPatterns: ['**/*.{js,css,html,svg,png,svg,ico}'],
                cleanupOutdatedCaches: true,
                clientsClaim: true,
                runtimeCaching: [{
                        urlPattern: function (_a) {
                            var request = _a.request;
                            return request.mode === 'navigate';
                        },
                        handler: 'NetworkFirst',
                    }]
            },
        })
    ]
});
