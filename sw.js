const CACHE_NAME = 'dea-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/data/typing-drills.js',
  '/data/curriculum.js',
  '/js/ui-modal.js',
  '/js/typing-dojo.js',
  '/js/simulators.js',
  '/js/island-scene.js',
  '/js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) return;
  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached || fetch(event.request).catch(() => caches.match('/index.html'))
    )
  );
});
