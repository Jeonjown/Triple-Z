import { useState } from "react";
import app, { requestFCMToken } from "@/utils/firebase-messaging";
import { deleteToken, getMessaging } from "firebase/messaging";

// Custom hook returns token, a function to request it, and a function to delete it.
export function useFCMToken(): {
  token: string | null;
  requestToken: () => Promise<void>;
  deleteCurrentToken: () => Promise<void>;
} {
  const [token, setToken] = useState<string | null>(null);

  // Request and store the FCM token
  const requestTokenFn = async (): Promise<void> => {
    try {
      const fcmToken: string | null = await requestFCMToken();
      setToken(fcmToken);
    } catch (error) {
      console.error("Error fetching FCM token:", error);
    }
  };

  // Delete the current FCM token and clear the state
  const deleteCurrentToken = async (): Promise<void> => {
    try {
      if (token) {
        await deleteToken(getMessaging(app));
        console.log("FCM token deleted");
        setToken(null);
      } else {
        console.log("No FCM token available to delete");
      }
    } catch (error) {
      console.error("Error deleting FCM token:", error);
    }
  };

  return { token, requestToken: requestTokenFn, deleteCurrentToken };
}
