/* Service worker: permite que la app abra sin señal usando la última base descargada. */
const CACHE = 'acceso-v8';
const ARCHIVOS = ['index.html', 'manifest.json', 'html5-qrcode.min.js', 'icono192.png', 'icono512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;          // la API siempre va a la red
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
