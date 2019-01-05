const cacheName = 'goatCache';
const offlineUrl = '/';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => cache.addAll([
                offlineUrl
            ]))
    );
});

function isHtmlPage(event) {
    return event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html');
}

self.addEventListener('fetch', event => {

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response && !isHtmlPage(event)) {
                    return response;
                }

                return fetch(event.request).then(
                    function (response) {
                        if (!response || response.status !== 200) {
                            return response;
                        }

                        let responseToCache = response.clone();
                        caches.open(cacheName)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                ).catch(error => {
                    if (isHtmlPage(event)) {
                        return caches.match(offlineUrl);
                    }
                });
            })
    );
});