const CACHE_NAME = 'galleyos-cache-v1.23';

// List all the files that the phone needs to save for offline use
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo-192.png',
  './logo-512.png',
  './skyserve/index.html',
  './restock/index.html',
  './briefing/index.html',
  './tdp/index.html'
];

// INSTALL: Download and save the new files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting(); 
});

// ACTIVATE: Delete the old cache versions
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Ensure the Service Worker takes control of all pages immediately.
  self.clients.claim();
});

// FETCH: Serve files from the cache, fallback to network if not found
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
