const CACHE = 'langla-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-maskable.svg',
  './css/style.css',
  './js/app.js',
  './js/parser.js',
  './js/content.js',
  './js/storage.js',
  './js/srs.js',
  './js/views/home.js',
  './js/views/review.js',
  './js/views/chapters.js',
  './js/views/chapter.js',
  './js/views/notepad.js',
  './content/index.json',
  './content/00-foundation.md',
  './content/01-greetings-and-respect.md',
  './content/02-hospitality.md',
  './content/03-family-relationships.md',
  './content/04-objects-and-spatial.md',
  './content/09-feelings-smalltalk.md',
  './content/bonus-questions.md',
  './content/bonus-numbers-extended.md',
  './content/_reference-verbs.md'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(req, copy));
        return res;
      }).catch(() => cached);
    })
  );
});
