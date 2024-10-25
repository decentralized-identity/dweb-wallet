import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

// @ts-ignore - vite-plugin-node-stdlib-browser does not have types
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
    nodePolyfills(),
    react(),
    VitePWA({
      manifestFilename: "manifest.json",
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      registerType: "prompt",
      injectRegister: "auto",

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: "DWeb Wallet",
        short_name: "DWW",
        description: "A Decentralized Web Wallet Reference",
        theme_color: "#ffec19",
        launch_handler: {
          client_mode: ['focus-existing', 'navigate-existing', 'auto' ]
        },
        protocol_handlers: [
          {
            protocol: "web5",
            url: "/app-connect?type=%s"
          }
        ]
      },

      injectManifest: {
        maximumFileSizeToCacheInBytes: 5000000,
        globPatterns: ["**/*.{js,css,html,json,svg,png,ico}"],
      },

      devOptions: {
        enabled: true,
        navigateFallback: "index.html",
        suppressWarnings: false,
        type: "module",
      }
    }),
  ],
});
