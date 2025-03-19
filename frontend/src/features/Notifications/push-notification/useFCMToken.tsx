import { useState } from "react";
import app, { requestFCMToken } from "@/utils/firebase-messaging";
import { deleteToken, getMessaging } from "firebase/messaging";
import axios from "axios";

export function useFCMToken(
  _id?: string,
  role?: "admin" | "user",
): {
  token: string | null;
  requestToken: () => Promise<void>;
  deleteCurrentToken: () => Promise<void>;
} {
  // Initialize token state from localStorage if available
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("fcmToken"),
  );
  console.log("Current token:", token);

  // Request the FCM token, store it in state and localStorage, and send it to the backend
  const requestTokenFn = async (): Promise<void> => {
    if (!_id || !role) {
      console.warn("No user data provided, skipping FCM token registration.");
      return;
    }
    try {
      const fcmToken: string | null = await requestFCMToken();
      if (fcmToken) {
        setToken(fcmToken);
        localStorage.setItem("fcmToken", fcmToken);
        const deviceInfo = window.navigator.userAgent;
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/subscriptions/register`,
          { token: fcmToken, user: { role, _id }, deviceInfo },
        );
        if (response.status !== 200) {
          console.error("Backend registration failed", response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching FCM token:", error);
    }
  };

  // Delete the token from backend, Firebase, and clear it from state and localStorage
  const deleteCurrentToken = async (): Promise<void> => {
    if (!token) {
      console.log("No FCM token available to delete");
      return;
    }
    console.log("Attempting to delete FCM token:", token);
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/subscriptions/remove`;
      console.log("Sending POST request to:", url);
      const response = await axios.post(url, { token });
      console.log("Axios response:", response);
      if (response.status !== 200) {
        console.error("Backend token removal failed", response.data);
      }
      await deleteToken(getMessaging(app));
      console.log("FCM token deleted from Firebase");
      setToken(null);
      localStorage.removeItem("fcmToken");
      console.log("Token state cleared (set to null)");
    } catch (error) {
      console.error("Error deleting FCM token:", error);
    }
  };

  return { token, requestToken: requestTokenFn, deleteCurrentToken };
}
