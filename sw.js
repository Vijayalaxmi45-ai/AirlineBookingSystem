const CACHE_NAME = 'skywings-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/about.html',
  '/flights.html',
  '/booking.html',
  '/contact.html',
  '/login.html',
  '/css/style.css',
  '/css/about.css',
  '/css/booking.css',
  '/css/contact.css',
  '/css/flights.css',
  '/css/login.css',
  '/js/script.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((resp) => resp || fetch(e.request).then((res) => {
      // Cache fetched CSS/JS/HTML for offline
      if (e.request.url.startsWith(self.location.origin)) {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match('/index.html')))
  );
});
