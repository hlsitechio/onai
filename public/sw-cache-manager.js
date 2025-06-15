
// Cache Management Module for OneAI Notes Service Worker
const CACHE_NAME = 'oneai-notes-v1.3.0';
const STATIC_CACHE = 'oneai-static-v1.3.0';
const DYNAMIC_CACHE = 'oneai-dynamic-v1.3.0';
const NOTES_CACHE = 'oneai-notes-data-v1.3.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/lovable-uploads/8a54ca4d-f005-4821-b9d8-3fd2958d340b.png',
];

// API endpoints that should be cached
const CACHEABLE_APIS = [
  '/api/notes',
  '/api/ai',
];

class CacheManager {
  static async initializeCaches() {
    return Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(NOTES_CACHE),
      caches.open(DYNAMIC_CACHE)
    ]);
  }

  static async cleanupOldCaches() {
    const cacheNames = await caches.keys();
    return Promise.all(
      cacheNames.map((cacheName) => {
        if (cacheName !== STATIC_CACHE && 
            cacheName !== DYNAMIC_CACHE && 
            cacheName !== NOTES_CACHE &&
            cacheName !== CACHE_NAME) {
          console.log('Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        }
      })
    );
  }

  static isStaticAsset(url) {
    return url.pathname.includes('/assets/') || 
           url.pathname.includes('/lovable-uploads/') ||
           url.pathname.endsWith('.png') ||
           url.pathname.endsWith('.jpg') ||
           url.pathname.endsWith('.svg') ||
           url.pathname.endsWith('.ico') ||
           url.pathname.includes('manifest.json');
  }

  static isAPIRequest(url) {
    return CACHEABLE_APIS.some(api => url.pathname.includes(api)) ||
           url.hostname.includes('supabase') ||
           url.hostname.includes('api');
  }

  static isNotesAPI(url) {
    return url.pathname.includes('/api/notes') || 
           url.pathname.includes('notes');
  }

  static isNavigationRequest(request) {
    return request.mode === 'navigate' || 
           (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
  }

  static async cacheFirst(request, cacheName) {
    try {
      const cache = await caches.open(cacheName);
      const cached = await cache.match(request);
      
      if (cached) {
        return cached;
      }
      
      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      console.error('Cache first failed:', error);
      return new Response('Offline', { status: 503 });
    }
  }

  static async networkFirst(request, cacheName) {
    try {
      const response = await fetch(request);
      
      if (response.ok) {
        const cache = await caches.open(cacheName);
        cache.put(request, response.clone());
      }
      
      return response;
    } catch (error) {
      console.log('Network failed, trying cache:', error);
      const cache = await caches.open(cacheName);
      const cached = await cache.match(request);
      
      if (cached) {
        return cached;
      }
      
      return new Response(JSON.stringify({ 
        error: 'Network unavailable', 
        offline: true 
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  static async staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    const fetchPromise = fetch(request).then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    }).catch(() => cached);
    
    return cached || fetchPromise;
  }

  static async handleNavigation(request) {
    try {
      return await fetch(request);
    } catch (error) {
      const cache = await caches.open(STATIC_CACHE);
      return cache.match('/') || cache.match('/index.html') || 
             new Response('App is offline', { 
               status: 503, 
               headers: { 'Content-Type': 'text/html' } 
             });
    }
  }

  static async handleNotesSave(request) {
    try {
      const response = await fetch(request);
      return response;
    } catch (error) {
      // Store offline and sync later
      const requestData = await request.json();
      await this.storeOfflineNote(requestData);
      
      // Register background sync
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        await self.registration.sync.register('sync-notes');
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        offline: true,
        message: 'Note saved offline, will sync when online' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  static async storeOfflineNote(noteData) {
    const db = await this.openOfflineDB();
    const transaction = db.transaction(['offline_notes'], 'readwrite');
    const store = transaction.objectStore('offline_notes');
    
    await store.add({
      ...noteData,
      timestamp: Date.now(),
      synced: false
    });
  }

  static openOfflineDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('OneAINotesOffline', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('offline_notes')) {
          const store = db.createObjectStore('offline_notes', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('synced', 'synced');
        }
      };
    });
  }
}

// Export cache constants and manager
self.CacheManager = CacheManager;
self.STATIC_CACHE = STATIC_CACHE;
self.DYNAMIC_CACHE = DYNAMIC_CACHE;
self.NOTES_CACHE = NOTES_CACHE;
