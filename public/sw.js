self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'BillTable', body: event.data ? event.data.text() : 'New notification' };
  }
  const title = data.title || 'BillTable';
  const options = {
    body: data.body || 'You have a new notification',
    data: { orderId: data.orderId }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('fetch', () => {});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/orders'));
});
