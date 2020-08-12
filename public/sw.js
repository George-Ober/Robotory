const timestamp = "0";
const cacheName = `cache-v${timestamp}`;
const filesToCache = [
    '/index.html',
    '/styles/index.css',
    '/scripts/index.js',
];

self.addEventListener("install", (event) => {
    console.log(event);
    event.waitUntil(
        //console.log(caches)
        caches.open(cacheName).then(cache => {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {

                }).map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.open(cacheName).then(cache => {
            return cache.match(event.request).then(response => {
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });

                return response || fetchPromise;
            })
        })
    )
});

/*
var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    '/',
    '/styles/main.css',
    '/script/main.js'
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                }
            )
    );
});*/
