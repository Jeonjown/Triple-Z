import axios from "axios";

// Set the baseURL to your backend server's address
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Define the payload and response interfaces
export interface NotificationPayload {
  title: string;
  description: string;
  userId: string;
}

export interface NotificationResponse {
  message: string;
}

/**
 * Send a notification to a specific user.
 */
export const sendNotificationToUser = async (
  title: string,
  description: string,
  userId: string,
): Promise<NotificationResponse> => {
  try {
    const response = await api.post("/api/subscriptions/send/user", {
      title,
      description,
      userId,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw {
        statusCode: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          "An error occurred while sending notification",
      };
    }
    throw { statusCode: 500, message: "An unexpected error occurred" };
  }
};

/**
 * Send a notification to all users.
 */
export const sendNotificationToAll = async (
  title: string,
  description: string,
  userId: string,
): Promise<NotificationResponse> => {
  try {
    const response = await api.post("/api/subscriptions/send/all", {
      title,
      description,
      userId,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw {
        statusCode: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          "An error occurred while sending notification",
      };
    }
    throw { statusCode: 500, message: "An unexpected error occurred" };
  }
};
