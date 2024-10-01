/// <reference lib="webworker" />
import { activatePolyfills } from "@web5/browser";

import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

declare let self: ServiceWorkerGlobalScope;

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});
// disable workbox logging
//@ts-expect-error - I don't know why this erros
self.__WB_DISABLE_DEV_LOGS = true;

// self.__WB_MANIFEST is the default injection point
precacheAndRoute([
  { url: 'index.html', revision: null },
  ...self.__WB_MANIFEST,
]);

// clean old assets
cleanupOutdatedCaches();

/** @type {RegExp[] | undefined} */
let allowlist;
// in dev mode, we disable precaching to avoid caching issues
//@ts-expect-error - I don't know why this is here
if (import.meta.env.DEV) allowlist = [/^\/$/];

// to allow work offline
registerRoute(
  new NavigationRoute(createHandlerBoundToURL("index.html"), { allowlist })
);

// Activate Web5 Service Worker Polyfills
activatePolyfills({
  onCacheCheck() {
    return {
      ttl: 30000,
    };
  },
});
