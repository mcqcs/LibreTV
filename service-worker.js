const CACHE_NAME = 'libre-tv-cache-v2'; // 更新缓存版本
const urlsToCache = [
  '/',
  '/css/styles.css',
  '/js/app.js',
  '/js/config.js',
  '/js/ui.js',
  '/js/api.js',
  '/js/password.js',
  '/libs/tailwindcss.min.js',
  '/libs/DPlayer.min.js',
  '/libs/hls.min.js',
  '/libs/sha256.min.js',
  '/https://images.icon-icons.com/38/PNG/512/retrotv_5520.png',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  // 清理旧缓存
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 如果请求成功，更新缓存
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request)) // 如果网络请求失败，使用缓存
  );
});
