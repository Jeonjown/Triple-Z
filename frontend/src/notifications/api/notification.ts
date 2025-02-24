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

export interface NotificationData {
  _id: string;
  title: string;
  description: string;
  userId: string;
  read: boolean;
  createdAt: Date;
}

export const createNotification = async (
  notificationData: NotificationData,
) => {
  try {
    // Await the promise to resolve and get the response
    const response = await api.post("/api/notifications", notificationData);
    return response.data;
  } catch (error) {
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

export const getNotificationsForUser = async (
  userId: string,
): Promise<NotificationData[]> => {
  try {
    // POST request with userId in the body
    const response = await api.post(`/api/notifications/get`, { userId });
    return response.data.notifications;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw {
        statusCode: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          "An error occurred while fetching notifications",
      };
    }
    throw { statusCode: 500, message: "An unexpected error occurred" };
  }
};
