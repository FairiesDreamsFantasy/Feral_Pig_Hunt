/**
 * Feral Pig Hunt - Standalone Service Worker (SW.js)
 * Caches essential shell assets for offline gameplay and instant re-loads.
 */
const CACHE_NAME = 'feral-pig-hunt-v0.6';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './Assets/CSS/style.css',
  './Assets/CSS/index.html',
  './Assets/JS/index.js',
  './Assets/JS/runtime.js',
  './Assets/JS/index.html',
  './Assets/index.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Caching partial list:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
