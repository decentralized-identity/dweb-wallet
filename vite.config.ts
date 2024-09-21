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
        nodePolyfills()
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
