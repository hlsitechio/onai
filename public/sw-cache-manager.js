
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

// Track failed requests to avoid repeated attempts
const failedRequests = new Set();
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 5000; // 5 seconds

class CacheManager {
  static async initializeCaches() {
    try {
      return Promise.all([
        caches.open(STATIC_CACHE).then((cache) => {
          return cache.addAll(STATIC_ASSETS);
        }),
        caches.open(NOTES_CACHE),
        caches.open(DYNAMIC_CACHE)
      ]);
    } catch (error) {
      console.error('Cache initialization failed:', error);
      // Create empty caches as fallback
      return Promise.all([
        caches.open(STATIC_CACHE),
        caches.open(NOTES_CACHE),
        caches.open(DYNAMIC_CACHE)
      ]);
    }
  }

  static async cleanupOldCaches() {
    try {
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
    } catch (error) {
      console.error('Cache cleanup failed:', error);
      return Promise.resolve();
    }
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
        // Start background update for fresh content (only if not recently failed)
        const requestKey = `${request.method}-${request.url}`;
        if (!failedRequests.has(requestKey)) {
          this.backgroundUpdate(request, cacheName);
        }
        return cached;
      }
      
      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      console.error('Cache first strategy failed:', error);
      return this.createOfflineResponse(request);
    }
  }

  static async networkFirst(request, cacheName) {
    try {
      const response = await fetch(request, { timeout: 5000 });
      
      if (response.ok) {
        const cache = await caches.open(cacheName);
        cache.put(request, response.clone());
      }
      
      return response;
    } catch (error) {
      console.log('Network failed, trying cache:', error);
      
      try {
        const cache = await caches.open(cacheName);
        const cached = await cache.match(request);
        
        if (cached) {
          return cached;
        }
      } catch (cacheError) {
        console.error('Cache access failed:', cacheError);
      }
      
      return this.createOfflineResponse(request);
    }
  }

  static async staleWhileRevalidate(request, cacheName) {
    try {
      const cache = await caches.open(cacheName);
      const cached = await cache.match(request);
      
      const fetchPromise = fetch(request).then((response) => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
        return response;
      }).catch((error) => {
        console.warn('Background fetch failed:', error);
        return cached;
      });
      
      return cached || fetchPromise;
    } catch (error) {
      console.error('Stale while revalidate failed:', error);
      return this.createOfflineResponse(request);
    }
  }

  static async handleNavigation(request) {
    try {
      const response = await fetch(request, { timeout: 3000 });
      return response;
    } catch (error) {
      console.log('Navigation request failed, serving cached version:', error);
      
      try {
        const cache = await caches.open(STATIC_CACHE);
        const cached = await cache.match('/') || await cache.match('/index.html');
        
        if (cached) {
          return cached;
        }
      } catch (cacheError) {
        console.error('Cache navigation fallback failed:', cacheError);
      }
      
      return new Response(this.getOfflineHTML(), { 
        status: 503, 
        headers: { 'Content-Type': 'text/html' } 
      });
    }
  }

  static async handleNotesSave(request) {
    try {
      const response = await fetch(request, { timeout: 10000 });
      return response;
    } catch (error) {
      console.log('Notes save failed, storing offline:', error);
      
      try {
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
      } catch (offlineError) {
        console.error('Offline storage failed:', offlineError);
        return new Response(JSON.stringify({ 
          error: 'Failed to save note offline', 
          details: offlineError.message 
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  }

  static async backgroundUpdate(request, cacheName) {
    const requestKey = `${request.method}-${request.url}`;
    
    // Skip if this request has failed recently
    if (failedRequests.has(requestKey)) {
      return;
    }

    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(request, { 
        signal: controller.signal,
        cache: 'no-cache' // Ensure we get fresh content
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const cache = await caches.open(cacheName);
        await cache.put(request, response.clone());
        console.log('Background update successful for:', request.url);
      } else {
        console.warn('Background update failed with status:', response.status, 'for:', request.url);
        this.markRequestAsFailed(requestKey);
      }
    } catch (error) {
      // Only log if it's not an abort error (timeout)
      if (error.name !== 'AbortError') {
        console.warn('Background update failed for:', request.url, error.message);
      }
      this.markRequestAsFailed(requestKey);
    }
  }

  static markRequestAsFailed(requestKey) {
    failedRequests.add(requestKey);
    
    // Remove from failed list after delay to allow retry
    setTimeout(() => {
      failedRequests.delete(requestKey);
    }, RETRY_DELAY);
  }

  static createOfflineResponse(request) {
    const url = new URL(request.url);
    
    if (this.isAPIRequest(url)) {
      return new Response(JSON.stringify({ 
        error: 'Network unavailable', 
        offline: true,
        retry: true
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Offline - Please check your connection', { 
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  static getOfflineHTML() {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>OneAI Notes - Offline</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #000; color: #fff; }
            h1 { color: #783DFF; }
            .offline-message { max-width: 400px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="offline-message">
            <h1>OneAI Notes</h1>
            <h2>You're offline</h2>
            <p>Please check your internet connection and try again.</p>
            <button onclick="window.location.reload()">Retry</button>
          </div>
        </body>
      </html>
    `;
  }

  static async storeOfflineNote(noteData) {
    try {
      const db = await this.openOfflineDB();
      const transaction = db.transaction(['offline_notes'], 'readwrite');
      const store = transaction.objectStore('offline_notes');
      
      await store.add({
        ...noteData,
        timestamp: Date.now(),
        synced: false
      });
    } catch (error) {
      console.error('Failed to store offline note:', error);
      throw error;
    }
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
