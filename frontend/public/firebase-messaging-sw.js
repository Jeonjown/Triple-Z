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

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    // Show notification through service worker
    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationOptions = {
        body: payload.notification?.body,
        icon: '/triple-z-logo.png',
        badge: '/triple-z-logo.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);

    // Forward to main app for sound
    const channel = new BroadcastChannel('notification_channel');
    channel.postMessage({ key: payload });
});