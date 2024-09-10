self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};

  const options = {
    body: data.body || 'You have a new message!',
    icon: 'assets/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Notification', options)
  );
});
