/* global ["./","./assets/app-BYXI56ZC.css","./assets/app-DZEWDPXY.js","./assets/char/body.webp","./assets/char/bow.webp","./assets/char/eye-l.webp","./assets/char/eye-r.webp","./assets/scenes/bedroom-day.webp","./assets/scenes/bedroom-night.webp","./assets/scenes/cabin-day.webp","./assets/scenes/cabin-night.webp","./assets/scenes/garden-day.webp","./assets/scenes/garden-night.webp","./assets/scenes/study-day.webp","./assets/scenes/study-night.webp","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./index.html","./manifest.webmanifest"], false */
// Service worker: offline app shell. Generated values are injected by scripts/build.mjs.
// Never caches cross-origin requests (AI backend, weather) — those must always be live.
const VERSION = '3092556433';
const PRECACHE = __PRECACHE__;
const DEV = __DEV__;
const CACHE = 'dabsy-' + VERSION;

self.addEventListener('install', (event) => {
  if (DEV) { self.skipWaiting(); return; }
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (DEV || req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate' || url.pathname.endsWith('/config.json')) {
    event.respondWith(
      fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req).then((r) => r || caches.match('./index.html') || caches.match('./')))
    );
    return;
  }
  event.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
    return res;
  })));
});
