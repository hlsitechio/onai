
// OneAI Notes Service Worker - Main Entry Point
importScripts('./sw-cache-manager.js');
importScripts('./sw-sync-manager.js');
importScripts('./sw-notification-manager.js');

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('OneAI Service Worker installing...');
  
  event.waitUntil(
    CacheManager.initializeCaches().then(() => {
      console.log('OneAI Service Worker installed successfully');
      self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('OneAI Service Worker activating...');
  
  event.waitUntil(
    CacheManager.cleanupOldCaches().then(() => {
      console.log('OneAI Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests with appropriate strategies
  if (request.method === 'GET') {
    if (CacheManager.isStaticAsset(url)) {
      event.respondWith(CacheManager.cacheFirst(request, STATIC_CACHE));
    } else if (CacheManager.isAPIRequest(url)) {
      event.respondWith(CacheManager.networkFirst(request, DYNAMIC_CACHE));
    } else if (CacheManager.isNavigationRequest(request)) {
      event.respondWith(CacheManager.handleNavigation(request));
    } else {
      event.respondWith(CacheManager.staleWhileRevalidate(request, DYNAMIC_CACHE));
    }
  } else if (request.method === 'POST' && CacheManager.isNotesAPI(url)) {
    event.respondWith(CacheManager.handleNotesSave(request));
  }
});

// Enhanced background sync with better queue management
self.addEventListener('sync', (event) => {
  SyncManager.handleSyncEvent(event);
});

// Enhanced push notification handler
self.addEventListener('push', (event) => {
  NotificationManager.handlePushEvent(event);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  NotificationManager.handleNotificationClick(event);
});

// Handle skip waiting messages
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
