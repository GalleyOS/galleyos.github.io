const CACHE_NAME = 'galleyos-cache-v1';

// These are the files the bouncer will save to the phone's hard drive
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo.png'
];

// Step 1: Install the Service Worker and save the files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Step 2: When offline, intercept network requests and serve the cached files
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return the cached version if we have it, otherwise try the network
      return response || fetch(event.request);
    })
  );
});
