
// Listen for incoming push messages.
self.addEventListener('push', async (event) => {
    try {
        // Parse the incoming dynamic data.
        const message = await event.data.json();
        const { title, description } = message;
        // Always use the logo from your public folder as the icon.
        event.waitUntil(
            self.registration.showNotification(title, {
                body: description,
                icon: './triple-z-logo.png',
            })
        );
    } catch (error) {
        console.error('Error handling push event:', error);
    }
});


