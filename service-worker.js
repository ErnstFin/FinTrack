// ========================================
// Service Worker for PWA
// ========================================

const CACHE_NAME = 'ngaturuang-v1.1.0';
const urlsToCache = [
    '.',
    'index.html',
    'feature.html',
    'landing.css',
    'landing.js',
    'styles.css',
    'app.js',
    'storage.js',
    'cloud-sync.js',
    'export.js',
    'pwa.js',
    'manifest.json',
    'icons/icon-192.png',
    'icons/icon-512.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
            })
            .catch(error => {
                console.error('Cache installation failed:', error);
            })
    );
    
    // Force the waiting service worker to become the active service worker
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
        })
    );
    
    // Claim all clients immediately
    return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                // Clone the request
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then(response => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone the response
                    const responseToCache = response.clone();
                    
                    // Add to cache
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                }).catch(error => {
                    console.error('Fetch failed:', error);
                    
                    // Return offline page if available
                    return caches.match('index.html');
                });
            })
    );
});

// Background sync for cloud synchronization
self.addEventListener('sync', event => {
    if (event.tag === 'sync-transactions') {
        event.waitUntil(syncTransactions());
    }
});

async function syncTransactions() {
    try {
        // Implement cloud sync logic here
        console.log('Background sync triggered');
        
        // Notify all clients about sync
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
        icon: 'icons/icon-192.png',
        badge: 'icons/icon-192.png',
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
        clients.openWindow('/')
    );
});

// Message from client
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
