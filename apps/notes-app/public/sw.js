// ONAI Service Worker
// Provides offline functionality, caching, and background sync

const CACHE_NAME = 'onai-v1.0.0';
const STATIC_CACHE = 'onai-static-v1.0.0';
const DYNAMIC_CACHE = 'onai-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg',
  // Add other static assets as needed
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\//,
  /\/supabase\//,
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('🔧 ONAI Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 ONAI Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('✅ ONAI Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ ONAI Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 ONAI Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ ONAI Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ ONAI Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    handleRequest(request, url)
  );
});

// Handle different types of requests with appropriate caching strategies
async function handleRequest(request, url) {
  try {
    // Strategy 1: Cache First (for static assets)
    if (isStaticAsset(url)) {
      return await cacheFirst(request);
    }

    // Strategy 2: Network First (for API calls)
    if (isApiCall(url)) {
      return await networkFirst(request);
    }

    // Strategy 3: Stale While Revalidate (for HTML pages)
    if (isHtmlPage(request)) {
      return await staleWhileRevalidate(request);
    }

    // Default: Network First
    return await networkFirst(request);

  } catch (error) {
    console.error('🚨 ONAI Service Worker: Request failed', error);
    return await getOfflineFallback(request);
  }
}

// Cache First Strategy - for static assets
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

// Network First Strategy - for API calls and dynamic content
async function networkFirst(request) {
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
    throw error;
  }
}

// Stale While Revalidate Strategy - for HTML pages
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const networkResponsePromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        const cache = caches.open(DYNAMIC_CACHE);
        cache.then(c => c.put(request, networkResponse.clone()));
      }
      return networkResponse;
    })
    .catch(() => null);

  return cachedResponse || await networkResponsePromise;
}

// Check if request is for static assets
function isStaticAsset(url) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

// Check if request is an API call
function isApiCall(url) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

// Check if request is for HTML page
function isHtmlPage(request) {
  return request.headers.get('accept')?.includes('text/html');
}

// Get offline fallback response
async function getOfflineFallback(request) {
  if (isHtmlPage(request)) {
    const cachedIndex = await caches.match('/');
    if (cachedIndex) {
      return cachedIndex;
    }
  }

  // Return a basic offline response
  return new Response(
    JSON.stringify({
      error: 'Offline',
      message: 'You are currently offline. Please check your internet connection.',
      timestamp: new Date().toISOString()
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

// Background Sync for note saving
self.addEventListener('sync', (event) => {
  console.log('🔄 ONAI Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'save-notes') {
    event.waitUntil(syncNotes());
  }
});

// Sync notes when connection is restored
async function syncNotes() {
  try {
    console.log('📝 ONAI Service Worker: Syncing notes...');
    
    // Get pending notes from IndexedDB or localStorage
    const pendingNotes = await getPendingNotes();
    
    if (pendingNotes.length > 0) {
      for (const note of pendingNotes) {
        try {
          await syncNote(note);
          await removePendingNote(note.id);
        } catch (error) {
          console.error('❌ Failed to sync note:', note.id, error);
        }
      }
    }
    
    console.log('✅ ONAI Service Worker: Notes sync complete');
  } catch (error) {
    console.error('❌ ONAI Service Worker: Notes sync failed', error);
  }
}

// Get pending notes (placeholder - implement with actual storage)
async function getPendingNotes() {
  // This would integrate with your actual storage system
  return [];
}

// Sync individual note (placeholder - implement with actual API)
async function syncNote(note) {
  // This would make the actual API call to save the note
  console.log('Syncing note:', note.id);
}

// Remove pending note (placeholder - implement with actual storage)
async function removePendingNote(noteId) {
  // This would remove the note from pending sync queue
  console.log('Removing pending note:', noteId);
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('📬 ONAI Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/vite.svg',
    badge: '/vite.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open ONAI',
        icon: '/vite.svg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/vite.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('ONAI', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 ONAI Service Worker: Notification clicked');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('💬 ONAI Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('🚀 ONAI Service Worker: Loaded successfully');

