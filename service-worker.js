// Service Worker for Push Notifications
const CACHE_NAME = 'medpal-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  )
})

// Push notification event
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  
  const options = {
    body: data.body || 'Time to take your medicine!',
    icon: '/medpal-icon.png',
    badge: '/medpal-badge.png',
    vibrate: [200, 100, 200],
    data: data,
    actions: [
      { action: 'taken', title: "I've taken it" },
      { action: 'snooze', title: 'Remind in 10 min' }
    ]
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Medicine Reminder', options)
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'taken') {
    // Handle medicine taken
    event.waitUntil(
      clients.openWindow('/?action=taken&id=' + event.notification.data.reminderId)
    )
  } else if (event.action === 'snooze') {
    // Handle snooze
    event.waitUntil(
      clients.openWindow('/?action=snooze&id=' + event.notification.data.reminderId)
    )
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})
