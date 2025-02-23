import axios from "axios";

// Set the baseURL to your backend server's address
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export const sendNotification = async (title: string, description: string) => {
  try {
    // Send a POST request to the notification endpoint.
    const response = await api.post("/api/subscriptions/send", {
      title,
      description,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Throw an error with status code and message from Axios error.
      throw {
        statusCode: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          "An error occurred while sending notification",
      };
    }
    // Handle unexpected errors.
    throw {
      statusCode: 500,
      message: "An unexpected error occurred",
    };
  }
};
