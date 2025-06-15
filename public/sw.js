// OneAI Notes Service Worker - Enhanced PWA Features
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
  // Add more critical assets as needed
];

// API endpoints that should be cached
const CACHEABLE_APIS = [
  '/api/notes',
  '/api/ai',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('OneAI Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(NOTES_CACHE),
      caches.open(DYNAMIC_CACHE)
    ]).then(() => {
      console.log('OneAI Service Worker installed successfully');
      self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('OneAI Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
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
    }).then(() => {
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
    if (isStaticAsset(url)) {
      event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (isAPIRequest(url)) {
      event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    } else if (isNavigationRequest(request)) {
      event.respondWith(handleNavigation(request));
    } else {
      event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
    }
  } else if (request.method === 'POST' && isNotesAPI(url)) {
    event.respondWith(handleNotesSave(request));
  }
});

// Enhanced background sync with better queue management
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-notes') {
    event.waitUntil(syncOfflineNotes());
  } else if (event.tag === 'connectivity-restored') {
    event.waitUntil(handleConnectivityRestored());
  }
});

// Enhanced push notification handler
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  
  let payload = {};
  try {
    payload = event.data ? JSON.parse(event.data.text()) : {};
  } catch (error) {
    console.error('Error parsing push payload:', error);
  }

  const options = {
    body: payload.body || 'New update available in OneAI Notes!',
    icon: '/lovable-uploads/8a54ca4d-f005-4821-b9d8-3fd2958d340b.png',
    badge: '/lovable-uploads/8a54ca4d-f005-4821-b9d8-3fd2958d340b.png',
    vibrate: [200, 100, 200],
    data: payload,
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' }
    ],
    tag: payload.tag || 'general',
    requireInteraction: payload.requireInteraction || false,
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || 'OneAI Notes', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification.tag);
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle skip waiting messages
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Helper functions
function isStaticAsset(url) {
  return url.pathname.includes('/assets/') || 
         url.pathname.includes('/lovable-uploads/') ||
         url.pathname.endsWith('.png') ||
         url.pathname.endsWith('.jpg') ||
         url.pathname.endsWith('.svg') ||
         url.pathname.endsWith('.ico') ||
         url.pathname.includes('manifest.json');
}

function isAPIRequest(url) {
  return CACHEABLE_APIS.some(api => url.pathname.includes(api)) ||
         url.hostname.includes('supabase') ||
         url.hostname.includes('api');
}

function isNotesAPI(url) {
  return url.pathname.includes('/api/notes') || 
         url.pathname.includes('notes');
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

async function cacheFirst(request, cacheName) {
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

async function networkFirst(request, cacheName) {
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

async function staleWhileRevalidate(request, cacheName) {
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

async function handleNavigation(request) {
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

async function handleNotesSave(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    // Store offline and sync later
    const requestData = await request.json();
    await storeOfflineNote(requestData);
    
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

async function storeOfflineNote(noteData) {
  const db = await openOfflineDB();
  const transaction = db.transaction(['offline_notes'], 'readwrite');
  const store = transaction.objectStore('offline_notes');
  
  await store.add({
    ...noteData,
    timestamp: Date.now(),
    synced: false
  });
}

async function syncOfflineNotes() {
  try {
    const db = await openOfflineDB();
    const transaction = db.transaction(['offline_notes'], 'readonly');
    const store = transaction.objectStore('offline_notes');
    const notes = await store.getAll();
    
    const unsyncedNotes = notes.filter(note => !note.synced);
    let syncCount = 0;
    
    for (const note of unsyncedNotes) {
      try {
        const response = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(note)
        });
        
        if (response.ok) {
          const updateTransaction = db.transaction(['offline_notes'], 'readwrite');
          const updateStore = updateTransaction.objectStore('offline_notes');
          note.synced = true;
          await updateStore.put(note);
          syncCount++;
        }
      } catch (error) {
        console.error('Failed to sync note:', error);
      }
    }
    
    // Notify clients about sync completion
    if (syncCount > 0) {
      const allClients = await clients.matchAll();
      allClients.forEach(client => {
        client.postMessage({
          type: 'SYNC_COMPLETED',
          count: syncCount
        });
      });
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function handleConnectivityRestored() {
  console.log('Handling connectivity restored');
  
  // Notify all clients about connectivity restoration
  const allClients = await clients.matchAll();
  allClients.forEach(client => {
    client.postMessage({
      type: 'CONNECTIVITY_RESTORED',
      timestamp: Date.now()
    });
  });
  
  // Trigger sync
  await syncOfflineNotes();
}

function openOfflineDB() {
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
