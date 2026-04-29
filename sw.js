// Change this version number every time you update your app!
const CACHE_NAME = 'galleyos-cache-v2'; 

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo.png'
];

// Step 1: Install and Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Forces the new worker to take over immediately
});

// Step 2: The Cleanup Crew (Deletes old versions)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Takes control of the pages immediately
});

// Step 3: Fetch Files
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
