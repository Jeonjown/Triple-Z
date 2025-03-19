importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyCo3eo8pg4VVfU30IBhFk08WITMiC9ltg8",
    authDomain: "triple-z-8c154.firebaseapp.com",
    projectId: "triple-z-8c154",
    storageBucket: "triple-z-8c154.firebasestorage.app",
    messagingSenderId: "1052313997587",
    appId: "1:1052313997587:web:9bb08febd46b3031824ae6",
    measurementId: "G-8P99XDWE8P"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("Received background message:", payload);

    const notificationTitle = payload.data?.title || 'New Notification';
    const notificationOptions = {
        body: payload.data?.body,
        icon: payload.data?.icon || '/triple-z-logo.png',
        badge: payload.data?.badge || '/triple-z-logo.png',
        data: {
            click_action: payload.data?.click_action || '/'
        },
        vibrate: [200, 100, 200]
    };

    // Optionally close any existing notifications before showing the new one
    self.registration.getNotifications().then((notifications) => {
        notifications.forEach((notification) => notification.close());
        self.registration.showNotification(notificationTitle, notificationOptions);
    });

    // Forward the payload to the main app if needed (e.g., to play sound)
    const channel = new BroadcastChannel('notification_channel');
    channel.postMessage({ key: payload });
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const redirectUrl = event.notification.data?.click_action || '/';

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            // If there's an existing window, navigate it
            for (const client of clientList) {
                if ('navigate' in client) {
                    client.navigate(redirectUrl);
                    return client.focus();
                }
            }

        })
    );
});
