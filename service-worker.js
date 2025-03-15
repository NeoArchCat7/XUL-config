var GHPATH = "/XUL-config";
var APP_PREFIX = "xulc_";

// The version of the cache. Every time you change any of the files
// you need to change this version (version_01, version_02…).
// If you don't change the version, the service worker will give your
// users the old files!
var VERSION = "version_01";

var URLS = [
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/styles.css`,
  `${GHPATH}/script.js`,
  `${GHPATH}/manifest.webmanifest`,
  `${GHPATH}/icons/icon-192x192.png`,
  `${GHPATH}/icons/icon-512x512.png`,
  `${GHPATH}/icons/apple-touch-icon.png`,
];

// install event
self.addEventListener("install", (evt) => {
  console.log("service worker installed");
});

// activate event
self.addEventListener("activate", (evt) => {
  console.log("service worker activated");
});

// fetch event
self.addEventListener("fetch", (evt) => {});
