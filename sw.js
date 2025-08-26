const CACHE_NAME = 'vinify-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(fetchRes => {
        const copy = fetchRes.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return fetchRes;
      }).catch(() => caches.match('./'));
    })
  );
});
