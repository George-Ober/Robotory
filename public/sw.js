const timestamp = "16";
const cacheName = `cache-v${timestamp}`;
const filesToCache = [
    '/',
    `/index.html?v=${timestamp}`,
    `/styles/index.css?v=${timestamp}`,
    `/scripts/index.js?v=${timestamp}`,
    `/socket.io/socket.io.js?v=${timestamp}`
];

self.addEventListener("install", (e) => {
    /*self.skipWaiting();
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            //return cache.addAll(filesToCache.map(url => new Request(url, {credentials: 'same-origin'})));
            return cache.addAll(filesToCache);
        })
    );*/
    self.skipWaiting();
    let cachesPromise = caches.open(cacheName).then((cache) => {
        return cache.addAll(filesToCache.map(url => new Request(url, {credentials: 'same-origin'})));
    });
    let tryPromise = new Promise((resolve, reject) => {
        Promise.all([cachesPromise]).then(() => {
            resolve();
        }, (e) => {
            console.log("Error whilst initialling the SW.");
            resolve();
        });
    });
    e.waitUntil(tryPromise);
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

self.addEventListener("fetch", e => {
    /*event.respondWith(
        caches.open(cacheName).then(cache => {
            return cache.match(event.request).then(response => {
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                }).catch(e => {});

                return response || fetchPromise;
            }).catch(e => {})
        }).catch(e => {})
    )*/
    let url = new URL(e.request.url);
    console.log(url);
    let doSearchCache = false;
    //if(["localhost"].indexOf(url.hostname) == -1){
        if(/\?v=\d+$/.test(url.search)){
            doSearchCache = true;
        }else if(url.pathname == "/"){
            doSearchCache = true;
        }
    //}
    console.log(doSearchCache);
    if(doSearchCache){
        e.respondWith(
            caches.match(e.request).then((response) => {
                if(response){
                    return response;
                }


                return fetch(e.request).then((response)=>{

                    //cache request for next use
                    if(response.ok){
                        return caches.open(cacheName).then((cache)=>{
                            cache.put(e.request, response.clone());
                            return response;
                        });
                    }
                    return response;
                });
            })
        );
    }
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
