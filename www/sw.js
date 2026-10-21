// Service Worker para Luna AI PWA
// Solo cachea recursos públicos estáticos. Nunca cachea /api/, conversaciones, recuerdos ni auth.

const CACHE_NAME = 'luna-ai-static-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-1024.png',
  '/sw.js'
];

// Install: cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS.map(url => new Request(url, {cache: 'no-store'})))
        .catch(err => console.warn('[SW] install failed:', err));
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: cache-first for static, network-only for /api/
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET
  if (event.request.method !== 'GET') return;

  // Never cache API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Offline: return a generic offline response for API
        return new Response(JSON.stringify({error: 'Sin conexión al servidor'}), {
          status: 503,
          headers: {'Content-Type': 'application/json; charset=utf-8'}
        });
      })
    );
    return;
  }

  // Skip auth/vk-owner endpoints
  if (url.pathname === '/vk-owner') {
    event.respondWith(fetch(event.request));
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Only cache successful same-origin GETs for static assets
        if (response.ok && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});

// Handle skipWaiting message from client
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});