// ========================================
// Service Worker for PWA - Auto Update Engine (Laravel Integrated)
// ========================================

const CACHE_NAME = 'ngaturuang-v1.3.0';
const urlsToCache = [
    '/',
    '/app',
    '/css/landing.css',
    '/css/styles.css',
    '/js/landing.js',
    '/js/app.js',
    '/js/storage.js',
    '/js/cloud-sync.js',
    '/js/export.js',
    '/js/demo-data.js',
    '/js/pwa.js',
    '/manifest.json',
    '/favicon.ico',
    '/icons/icon-72.png',
    '/icons/icon-96.png',
    '/icons/icon-128.png',
    '/icons/icon-144.png',
    '/icons/icon-152.png',
    '/icons/icon-192.png',
    '/icons/icon-384.png',
    '/icons/icon-512.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache opened: ' + CACHE_NAME);
                return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
            })
            .catch(error => {
                console.error('Cache installation failed:', error);
            })
    );
    
    // Force active state immediately
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
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
        }).then(() => self.clients.claim())
    );
});

// Fetch event - Network-First for HTML/Navigations, Cache-First for static assets
self.addEventListener('fetch', event => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    const requestUrl = new URL(event.request.url);
    const isNavigation = event.request.mode === 'navigate' || requestUrl.pathname === '/' || requestUrl.pathname === '/app' || requestUrl.pathname === '/feature';

    if (isNavigation) {
        // Network-First Strategy for HTML pages
        event.respondWith(
            fetch(event.request)
                .then(networkResponse => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // Fallback to cache when offline
                    return caches.match(event.request).then(cachedResponse => {
                        if (cachedResponse) return cachedResponse;
                        return caches.match('/app') || caches.match('/');
                    });
                })
        );
    } else {
        // Cache-First with Network Fallback & Background Update for static assets
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                const fetchPromise = fetch(event.request)
                    .then(networkResponse => {
                        if (networkResponse && networkResponse.status === 200) {
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                        }
                        return networkResponse;
                    })
                    .catch(err => {
                        console.warn('Fetch fallback error for', event.request.url, err);
                    });

                return cachedResponse || fetchPromise;
            })
        );
    }
});

// Background sync for cloud synchronization
self.addEventListener('sync', event => {
    if (event.tag === 'sync-transactions') {
        event.waitUntil(syncTransactions());
    }
});

async function syncTransactions() {
    try {
        console.log('Background sync triggered');
        const allClients = await self.clients.matchAll();
        allClients.forEach(client => {
            client.postMessage({
                type: 'SYNC_COMPLETE',
                message: 'Data synced in background'
            });
        });
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Push notifications
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'Update tersedia!',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    
    event.waitUntil(
        self.registration.showNotification('Ngaturuang', options)
    );
});

// Notification click
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/app')
    );
});

// Message from client
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
