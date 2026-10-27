// UDHAYA AQUATICS - Production-Safe Service Worker
// Version: 1.0.0

const CACHE_NAME = 'udhaya-aquatics-v2';

// Static assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
];

// Domains and URL patterns that must NEVER be intercepted or cached
const BYPASS_PATTERNS = [
  '/api/payments',
  '/api/orders',
  '/api/users',
  '/api/admin',
  '/api/upload',
  '/api/contact',
  'api.razorpay.com',
  'checkout.razorpay.com',
  'res.cloudinary.com',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Pre-caching non-fatal warning:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. CRITICAL: Never intercept non-HTTP(S) schemes (upi://, intent://, mailto:, tel:)
  // Intercepting these causes ERR_UNKNOWN_URL_SCHEME in Chrome/Edge/WebView
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // 2. Never intercept non-GET requests (POST, PUT, DELETE, etc.)
  if (event.request.method !== 'GET') {
    return;
  }

  // 3. Never cache or intercept sensitive payment, auth, admin, or gateway requests
  const isBypassUrl = BYPASS_PATTERNS.some((pattern) => event.request.url.includes(pattern));
  if (isBypassUrl) {
    return;
  }

  // 4. For HTML document navigation, use Network-First strategy
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // 5. For static assets (JS, CSS, fonts, webp/svg), use Cache-First with Network fallback
  const isStaticAsset = /\.(js|css|woff2|woff|ttf|png|jpg|jpeg|webp|svg|ico)$/i.test(url.pathname);
  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Default: pass through directly to network
});
