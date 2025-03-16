import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Vite automatically loads env variables starting with VITE_ into import.meta.env

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "triple-z-8c154.firebaseapp.com",
  projectId: "triple-z-8c154",
  storageBucket: "triple-z-8c154.firebasestorage.app",
  messagingSenderId: "1052313997587",
  appId: "1:1052313997587:web:9bb08febd46b3031824ae6",
  measurementId: "G-8P99XDWE8P",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

export default app;

// Initialize Messaging
const messaging = getMessaging(app);

/**
 * Requests notification permission and retrieves the FCM token.
 */
export async function requestFCMToken(): Promise<string | null> {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPID_KEY,
    });

    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
}
// Handle foreground messages
onMessage(messaging, (payload) => {
  console.log("Foreground message:", payload);
  if (payload.notification) {
    new Notification(payload.notification.title!, {
      body: payload.notification.body,
      icon: "/triple-z-logo.png",
      badge: "/triple-z-logo.png",
    });

    // Play notification sound
    const audio = new Audio("/notification-sound.mp3");
    audio.play().catch((error) => console.log("Audio play failed:", error));
  }
});
