self.importScripts('data/games.js'); //Para cargar javascript que podamos necesitar en el worker

// Files to cache
const cacheName = 'js13kPWA-v1';
const appShellFiles = [
  '/js13kpwa/',
  '/js13kpwa/index.html',
  '/js13kpwa/app.js',
  '/js13kpwa/style.css',
  '/js13kpwa/fonts/graduate.eot',
  '/js13kpwa/fonts/graduate.ttf',
  '/js13kpwa/fonts/graduate.woff',
  '/js13kpwa/favicon.ico',
  '/js13kpwa/img/js13kgames.png',
  '/js13kpwa/img/bg.png',
  '/js13kpwa/icons/icon-32.png',
  '/js13kpwa/icons/icon-64.png',
  '/js13kpwa/icons/icon-96.png',
  '/js13kpwa/icons/icon-128.png',
  '/js13kpwa/icons/icon-168.png',
  '/js13kpwa/icons/icon-192.png',
  '/js13kpwa/icons/icon-256.png',
  '/js13kpwa/icons/icon-512.png',
];

const gamesImages = [];
for (let i = 0; i < games.length; i++) {
  gamesImages.push(`data/img/${games[i].slug}.jpg`);
}
const contentToCache = appShellFiles.concat(gamesImages); //Une los dos arrays en uno

// Installing Service Worker
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(contentToCache);
  })());
});

self.addEventListener('activate', (e) => { //Cuando se activa el worker
  console.log('[Service Worker] Activate');
  e.waitUntil(caches.keys().then((keyList) => { //Recupera todas las keys de la cache
    return Promise.all(keyList.map((key) => { //Con cada key...
      if (key === cacheName) { return; } //...comprobamos si es la key que usamos ahora, y sino es...
      return caches.delete(key); //...la borramos
    }))
  }));
});

// Fetching content using Service Worker
self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    const r = await caches.match(e.request); //Comprueba si la petición esta en la cache
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) return r; //Si la petición estaba en la cache, retorna el valor de la cache
    const response = await fetch(e.request); //... en caso contrario hace el fetch
    const cache = await caches.open(cacheName); //abrimos la cache para guardar el resultado
    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone()); //Guarda en la cache el resultado. Hay que clonar el stream, porque una vez leido no se puede leer otra vez
    return response;
  })());
});



