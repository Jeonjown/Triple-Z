import axios from "axios";

// Set the baseURL to your backend server's address
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Payload for notifying admins
export interface AdminPushNotificationPayload {
  title: string;
  body: string;
}

// Payload for sending a push notification to a user
export interface UserPushNotificationPayload {
  userId: string;
  title: string;
  body: string;
  icon?: string;
  click_action?: string;
}

// Expected response from the push notification API
export interface PushNotificationResponse {
  message: string;
}

// API function for admin push notifications
export const notifyAdmins = async (
  payload: AdminPushNotificationPayload,
): Promise<PushNotificationResponse> => {
  const response = await api.post(
    "/api/push-notifications/notify-admins",
    payload,
  );
  return response.data;
};

// API function for sending a push notification to a user
export const sendPushNotificationToUser = async (
  payload: UserPushNotificationPayload,
): Promise<PushNotificationResponse> => {
  const response = await api.post("/api/push-notifications/send", payload);
  return response.data;
};
