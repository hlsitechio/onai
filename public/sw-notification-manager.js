
// Push Notification Management Module for OneAI Notes Service Worker

class NotificationManager {
  static handlePushEvent(event) {
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
  }

  static handleNotificationClick(event) {
    console.log('Notification clicked:', event.notification.tag);
    
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
      event.waitUntil(
        clients.openWindow('/')
      );
    }
  }
}

// Export notification manager
self.NotificationManager = NotificationManager;
