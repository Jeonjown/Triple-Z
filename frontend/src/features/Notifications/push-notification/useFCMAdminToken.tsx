import axios from "axios";
import { useEffect, useState } from "react";
import { useFCMToken } from "./useFCMToken";

export function useFCMAdminToken(): {
  token: string | null;
  requestAdminToken: () => Promise<void>;
  requestAdminUnsubscribe: () => Promise<void>;
} {
  const { token, requestToken } = useFCMToken();
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Automatically subscribe/unsubscribe when token changes
  useEffect(() => {
    if (token && isSubscribed) {
      axios.post(
        `${import.meta.env.VITE_API_URL}/api/subscriptions/subscribe-admin`,
        { token },
      );
    }
  }, [token, isSubscribed]);

  const requestAdminToken = async (): Promise<void> => {
    await requestToken();
    setIsSubscribed(true);
  };

  const requestAdminUnsubscribe = async (): Promise<void> => {
    if (token) {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/subscriptions/unsubscribe-admin`,
        { token },
      );
      setIsSubscribed(false);
    }
  };

  return { token, requestAdminToken, requestAdminUnsubscribe };
}
