const CACHE_NAME = 'japanese-review-v3';
const urlsToCache = [
  '/japanese_review/',
  '/japanese_review/index.html',
  '/japanese_review/manifest.json',
  '/japanese_review/icon-192x192.png',
  '/japanese_review/icon-512x512.png'
];

// Install event
self.addEventListener('install', (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  // Claim clients to start controlling existing tabs
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Fetch event - improved caching strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Clone the request because it's a stream
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response because it's a stream
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
  );
});

// Background sync for saving user data
self.addEventListener('sync', (event) => {
  if (event.tag === 'save-user-data') {
    event.waitUntil(
      // Save any pending user data when back online
      saveUserData()
    );
  }
});

// Handle app visibility changes
self.addEventListener('visibilitychange', (event) => {
  // Keep app data in memory when minimized
  if (document.visibilityState === 'hidden') {
    // App is minimized, save state
    event.waitUntil(saveAppState());
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent());
  }
});

// Helper functions
function saveUserData() {
  return new Promise((resolve) => {
    // Save user progress to localStorage
    resolve();
  });
}

function saveAppState() {
  return new Promise((resolve) => {
    // Save current app state
    resolve();
  });
}

function syncContent() {
  return new Promise((resolve) => {
    // Sync any content updates
    resolve();
  });
}

// Keep service worker alive
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'KEEP_ALIVE') {
    // Respond to keep-alive ping
    event.ports[0].postMessage('ALIVE');
  }
});