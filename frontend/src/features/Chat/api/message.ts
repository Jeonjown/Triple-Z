import axios from "axios";

// Set the baseURL to your backend server's address
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export interface Message {
  username: string;
  userId: string;
  _id?: string;
  roomId: string;
  text: string;
  sender: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

export interface RoomLatestMessage {
  roomId: string;
  latestMessage: Message;
}

export const fetchMessagesForRoom = async (
  roomId: string,
): Promise<Message[]> => {
  try {
    // GET request to your endpoint: /api/messages/:roomId
    const response = await api.get(`/api/messages/${roomId}`);
    return response.data; // Assuming the backend returns messages directly
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw {
        statusCode: error.response?.status || 500,
        message:
          error.response?.data?.error ||
          "An error occurred while fetching messages",
      };
    }
    throw { statusCode: 500, message: "An unexpected error occurred" };
  }
};

export const fetchRoomsWithLatestMessage = async (): Promise<
  RoomLatestMessage[]
> => {
  try {
    // GET request to your endpoint: /api/messages/rooms-latest
    const response = await api.get(`/api/messages/`);
    return response.data; // Assuming the backend returns the aggregated results
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw {
        statusCode: error.response?.status || 500,
        message:
          error.response?.data?.error ||
          "An error occurred while fetching rooms",
      };
    }
    throw { statusCode: 500, message: "An unexpected error occurred" };
  }
};
