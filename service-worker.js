const worker = globalThis.self;

const CACHE_VERSION = '0.0.3';
const CACHE_NAME = `life-with-favorites-cache-v${CACHE_VERSION}`;

const BASE_URL = '/';
const CACHE_FILES = [
  BASE_URL,
  `${BASE_URL}index.html`,
  `${BASE_URL}manifest.json`,
  `${BASE_URL}register-service-worker.js`,
  `${BASE_URL}assets/app.css`,
  `${BASE_URL}assets/app.js`
];

worker.addEventListener('install', (event) => {
  event.waitUntil(worker.skipWaiting());
});

worker.addEventListener('fetch', (event) => {
  if (
    !CACHE_FILES.some((file) => event.request.url.includes(file)) &&
    !event.request.url.startsWith('http') &&
    !event.request.url.endsWith('.png') &&
    !event.request.url.endsWith('.webp')
  ) {
    // Not cache ...
    return;
  }

  if (event.request.url.includes('chrome-extension')) {
    // Not cache ...
    return;
  }

  const promise = caches
    .match(event.request)
    .then((response) => {
      if (response) {
        return response;
      }

      const request = event.request.clone();

      return fetch(request)
        .then((response) => {
          const responseToCache = response.clone();

          caches
            .open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            })
            .catch((error) => {
              console.error(error);
            });

          return response;
        })
        .catch((error) => {
          console.error(error);

          // for `Promise<Response>`
          return new Response();
        });
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);

      // for `Promise<Response>`
      return new Response();
    });

  event.respondWith(promise);
});

worker.addEventListener('activate', (event) => {
  const promise = caches
    .keys()
    .then((cacheNames) => {
      return Promise
        .all(cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
        );
    })
    .catch((error) => {
      console.error(error);
    });

  event.waitUntil(promise);
});
