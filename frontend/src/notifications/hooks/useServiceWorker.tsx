import useAuthStore from "@/features/Auth/stores/useAuthStore";
import axios from "axios";

// Convert a URL-safe base64 string to a Uint8Array.
const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
};

export const useServiceworker = () => {
  const { user } = useAuthStore();
  const frontendUrl: string = import.meta.env.VITE_FRONTEND_URL || "";
  const vapidPublicKey: string | undefined = import.meta.env
    .VITE_VAPID_PUBLIC_KEY;
  if (!vapidPublicKey) {
    throw new Error("No valid public key provided");
  }

  // Register the service worker.
  const regSw = async (): Promise<ServiceWorkerRegistration> => {
    if ("serviceWorker" in navigator) {
      const swUrl: string = `${frontendUrl}/sw.js`;
      const reg: ServiceWorkerRegistration =
        await navigator.serviceWorker.register(swUrl, { scope: "/" });
      return reg;
    }
    throw new Error("Service worker not supported");
  };

  // Subscribe to push notifications.
  const subscribe = async (
    serviceWorkerReg: ServiceWorkerRegistration,
  ): Promise<void> => {
    let subscription = await serviceWorkerReg.pushManager.getSubscription();
    if (!subscription) {
      const convertedKey: Uint8Array = urlBase64ToUint8Array(vapidPublicKey);
      subscription = await serviceWorkerReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
      });
    }
    // Convert the subscription to JSON and add the userId.
    const subscriptionData = { ...subscription.toJSON(), userId: user?._id };
    const apiUrl: string | undefined = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      throw new Error("VITE_API_URL is not defined");
    }
    // Send the dynamic subscription object to your backend.
    await axios.post(`${apiUrl}/api/subscriptions/subscribe`, subscriptionData);
  };

  async function registerAndSubscribe() {
    try {
      const serviceWorkerReg = await regSw();
      await subscribe(serviceWorkerReg);
    } catch (error) {
      console.log(error);
    }
  }

  // Unsubscribe from push notifications on logout.
  const unsubscribe = async (): Promise<void> => {
    if ("serviceWorker" in navigator) {
      try {
        // Get the existing service worker registration at the root scope.
        const registration = await navigator.serviceWorker.getRegistration("/");
        if (registration) {
          // Get the current push subscription.
          const subscription = await registration.pushManager.getSubscription();
          if (subscription) {
            // Unsubscribe from push notifications.
            const unsubscribed = await subscription.unsubscribe();
            if (unsubscribed) {
              // Optionally, notify your backend to remove the subscription record.
              await axios.post("/api/subscriptions/unsubscribe", {
                endpoint: subscription.endpoint,
              });
              console.log("Push subscription removed successfully");
            } else {
              console.error("Failed to unsubscribe from push notifications");
            }
          } else {
            console.log("No push subscription found to unsubscribe");
          }
        }
      } catch (error) {
        console.error("Error during unsubscription:", error);
      }
    } else {
      console.error("Service workers are not supported in this browser");
    }
  };

  return { regSw, subscribe, registerAndSubscribe, unsubscribe };
};
