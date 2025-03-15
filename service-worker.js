var GHPATH = "/XUL-config";
var APP_PREFIX = "xulc_";
var VERSION = "version_01";
var CACHE_NAME = APP_PREFIX + VERSION;

var URLS = [
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/style.css`,
  `${GHPATH}/script.js`,
  `${GHPATH}/manifest.webmanifest`,
  `${GHPATH}/icons/icon-192x192.png`,
  `${GHPATH}/icons/icon-512x512.png`,
  `${GHPATH}/icons/apple-touch-icon.png`,
];

// install event
self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("caching files");
      return cache.addAll(URLS);
    })
  );
});

// activate event
self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("deleting old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// fetch event
self.addEventListener("fetch", (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((response) => {
      return response || fetch(evt.request);
    })
  );
});
