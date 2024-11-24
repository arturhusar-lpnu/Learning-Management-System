// version 1.9
const urls = [
  // "/",
  //"/index.html",
  //"/script.js",
  //"/styles.css",
  "/img/bell.png",
  "/img/edit.png",
  "/img/close.png",
  "/img/sender.png",
  "/img/user.png",
  "/tasks.html",
];
const cacheName = "lab4-v1";
const addToCache = async (resources) => {
  const cache = await caches.open(cacheName);
  await cache.addAll(resources);
};

self.addEventListener("install", (e) => {
  e.waitUntil(
    addToCache(urls).then(() => {
      console.log("Refreshed cache");
    })
  );
});

self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      if (response) {
        return response;
      }
      return fetch(e.request);
    })
  );
});
