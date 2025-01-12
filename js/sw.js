const cacheName = "v1";
const cacheFiles = [
    "/",
    "/css/style.css",
    "/images/icon-pwa144x144.png",
    "/images/icon-pwa192x192.png",
    "/images/icon-maskable-512x512.png",
    "/icons",
    "/js/script.js"
];


self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(cacheName)
            .then((cache) => {
                cache.addAll(cacheFiles);
            })
    );
});

self.addEventListener("activate", (event) => {
    const cacheAllowlist = [cacheName];

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (!cacheAllowlist.includes(name)) {
                        console.log(`Deleting old cache: ${name}`);
                        return caches.delete(name);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch',(event)=>{
    event.respondWith(caches.open(cacheName).then((cache)=>{
        return fetch(event.request.url).then((fetchResponse)=>{
            cache.put(event.request, fetchResponse.clone());

            return fetchResponse;
        }).catch(()=>{
            return cache.match(event.request.url);
        });
    }));

});



