self.addEventListener('push', (event) => {
    const options = {
      body: event.data.text()
    };
  
    event.waitUntil(
      self.registration.showNotification('Appointment Reminder', options)
    );
});