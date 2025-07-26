// Enhanced Zamzam Gallery - Service Worker
const CACHE_NAME = 'zamzam-gallery-v2.0.0';
const STATIC_CACHE = 'zamzam-static-v2.0.0';
const DYNAMIC_CACHE = 'zamzam-dynamic-v2.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/script.js',
    '/js/cloud-storage.js',
    '/manifest.json',
    '/assets/favicon.ico',
    '/assets/apple-touch-icon.png',
    // Audio files
    '/audio/click.wav',
    '/audio/upload.wav',
    '/audio/notification.wav',
    '/audio/welcome.wav'
];

// External resources to cache
const EXTERNAL_RESOURCES = [
    'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Noto+Sans+Arabic:wght@300;400;600;700;900&family=Amiri:wght@400;700&family=Tajawal:wght@300;400;500;700;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/masonry/4.2.2/masonry.pkgd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/imagesloaded/4.1.4/imagesloaded.pkgd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        Promise.all([
            // Cache static files
            caches.open(STATIC_CACHE).then((cache) => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            }),
            // Cache external resources
            caches.open(DYNAMIC_CACHE).then((cache) => {
                console.log('Service Worker: Caching external resources');
                return Promise.allSettled(
                    EXTERNAL_RESOURCES.map(url => 
                        cache.add(url).catch(err => console.log(`Failed to cache ${url}:`, err))
                    )
                );
            })
        ]).then(() => {
            console.log('Service Worker: Installation complete');
            return self.skipWaiting();
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activation complete');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve cached files or fetch from network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http(s) requests
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // Handle different types of requests
    if (isStaticFile(request.url)) {
        event.respondWith(cacheFirst(request));
    } else if (isAPIRequest(request.url)) {
        event.respondWith(networkFirst(request));
    } else if (isImageRequest(request.url)) {
        event.respondWith(cacheFirstWithFallback(request));
    } else {
        event.respondWith(networkFirstWithCache(request));
    }
});

// Cache strategies
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Cache first strategy failed:', error);
        return new Response('Offline content not available', { status: 503 });
    }
}

async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Network first strategy failed, trying cache:', error);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response('Network and cache unavailable', { status: 503 });
    }
}

async function cacheFirstWithFallback(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Image request failed, returning placeholder:', error);
        // Return a placeholder image for failed image requests
        return caches.match('/assets/placeholder.jpg') || 
               new Response('Image not available', { status: 404 });
    }
}

async function networkFirstWithCache(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response('Content not available offline', { status: 503 });
    }
}

// Helper functions
function isStaticFile(url) {
    return STATIC_FILES.some(file => url.includes(file)) ||
           url.includes('.css') ||
           url.includes('.js') ||
           url.includes('.html') ||
           url.includes('/assets/');
}

function isAPIRequest(url) {
    return url.includes('/api/') ||
           url.includes('googleapis.com') ||
           url.includes('dropboxapi.com') ||
           url.includes('graph.microsoft.com');
}

function isImageRequest(url) {
    return url.includes('.jpg') ||
           url.includes('.jpeg') ||
           url.includes('.png') ||
           url.includes('.gif') ||
           url.includes('.webp') ||
           url.includes('.svg') ||
           url.includes('picsum.photos');
}

// Background sync for uploading files when online
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered');
    
    if (event.tag === 'upload-media') {
        event.waitUntil(syncUploadQueue());
    } else if (event.tag === 'sync-cloud') {
        event.waitUntil(syncWithCloud());
    }
});

async function syncUploadQueue() {
    try {
        // Get upload queue from IndexedDB or localStorage
        const uploadQueue = await getUploadQueue();
        
        for (const item of uploadQueue) {
            try {
                await uploadToServer(item);
                await removeFromUploadQueue(item.id);
                
                // Notify the main app
                self.clients.matchAll().then(clients => {
                    clients.forEach(client => {
                        client.postMessage({
                            type: 'UPLOAD_SUCCESS',
                            data: item
                        });
                    });
                });
            } catch (error) {
                console.log('Failed to upload item:', error);
            }
        }
    } catch (error) {
        console.log('Background sync failed:', error);
    }
}

async function syncWithCloud() {
    try {
        // Trigger cloud sync
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'TRIGGER_CLOUD_SYNC'
                });
            });
        });
    } catch (error) {
        console.log('Cloud sync failed:', error);
    }
}

// Push notifications
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'إشعار جديد من معرض زمزم',
        icon: '/assets/apple-touch-icon.png',
        badge: '/assets/favicon.ico',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'استكشاف',
                icon: '/assets/explore-icon.png'
            },
            {
                action: 'close',
                title: 'إغلاق',
                icon: '/assets/close-icon.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('معرض زمزم المحسن', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'close') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.matchAll().then(clientList => {
                if (clientList.length > 0) {
                    return clientList[0].focus();
                }
                return clients.openWindow('/');
            })
        );
    }
});

// Message handling from main app
self.addEventListener('message', (event) => {
    console.log('Service Worker: Message received:', event.data);
    
    if (event.data && event.data.type) {
        switch (event.data.type) {
            case 'SKIP_WAITING':
                self.skipWaiting();
                break;
            case 'CACHE_MEDIA':
                cacheMediaFile(event.data.url);
                break;
            case 'CLEAR_CACHE':
                clearAllCaches();
                break;
            case 'GET_CACHE_SIZE':
                getCacheSize().then(size => {
                    event.ports[0].postMessage({ cacheSize: size });
                });
                break;
        }
    }
});

// Utility functions for message handling
async function cacheMediaFile(url) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.add(url);
        console.log('Media file cached:', url);
    } catch (error) {
        console.log('Failed to cache media file:', error);
    }
}

async function clearAllCaches() {
    try {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('All caches cleared');
    } catch (error) {
        console.log('Failed to clear caches:', error);
    }
}

async function getCacheSize() {
    try {
        const cacheNames = await caches.keys();
        let totalSize = 0;
        
        for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();
            
            for (const request of requests) {
                const response = await cache.match(request);
                if (response) {
                    const blob = await response.blob();
                    totalSize += blob.size;
                }
            }
        }
        
        return totalSize;
    } catch (error) {
        console.log('Failed to calculate cache size:', error);
        return 0;
    }
}

// IndexedDB helpers for upload queue
async function getUploadQueue() {
    // This would use IndexedDB to store upload queue
    // For now, return empty array
    return [];
}

async function removeFromUploadQueue(id) {
    // Remove item from IndexedDB upload queue
    console.log('Removing from upload queue:', id);
}

async function uploadToServer(item) {
    // Upload item to server
    console.log('Uploading to server:', item);
    // This would make actual upload request
}

