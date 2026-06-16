self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'BillTable';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: { orderId: data.orderId }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/orders'));
});
