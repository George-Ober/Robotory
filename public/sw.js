const timestamp = "8";
const cacheName = `cache-v${timestamp}`;
const filesToCache = [
    '/index.html',
    '/styles/index.css',
    '/scripts/index.js',
];

self.addEventListener("install", (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            //return cache.addAll(filesToCache.map(url => new Request(url, {credentials: 'same-origin'})));
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                let result = /cache-v(\d+)/.exec(key);
                if(result && result[1] != timestamp){
                    return caches.delete(key);
                }
            }));
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
                }).catch(e => {});

                return response || fetchPromise;
            }).catch(e => {})
        }).catch(e => {})
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
