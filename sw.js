var cacheName = 'pwa-cache';
var cacheFiles = [
                    './',
                    './sw.js',
                    './sw.html',
                    './amp.js',
                    './amp.html',
                    './support/',
                    './technical/',
                    './resume/',
                    './images/manifest.json',
                    './fonts/raleway.woff',
                    './fonts/raleway.woff2',
                    './fonts/bitter.woff',
                    './fonts/bitter.woff2',
                    './images/logo.png',
                    './images/top.svg',
                    './images/rss.svg',
                    './images/twitter.svg',
                    './images/linkedin.svg',
                    './images/brett.jpg',
                    'https://cdn.ampproject.org/v0.js',
                    'https://cdn.ampproject.org/v0/amp-install-serviceworker-0.1.js'
                  ]

self.addEventListener('install', function(e) {  
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('activate', function(e) {  
    e.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(cacheNames.map(function(thisCacheName) {
                if (thisCacheName !== cacheName) {
                    return caches.delete(thisCacheName);
                }
            }));
        })
    );
});


self.addEventListener('fetch', function(e) {  
    e.respondWith(
        caches.match(e.request)
            .then(function(response) {
                if ( response ) {
                    return response;
                }
                var requestClone = e.request.clone();
                fetch(requestClone)
                    .then(function(response) {
                        if ( !response ) {
                            return response;
                        }
                        var responseClone = response.clone();
                        caches.open(cacheName).then(function(cache) {
                            cache.put(e.request, responseClone);
                            return response;
                        }); 
                    })
                    .catch(function(err) {
                        });
            }) 
    );
});