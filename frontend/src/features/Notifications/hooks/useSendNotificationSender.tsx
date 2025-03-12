import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

// Define the shape of your notification data
export type NotificationData = {
  _id?: string;
  userId: string;
  title: string;
  description: string;
  redirectUrl: string;
  read?: boolean;
};

interface JoinRoomResponse {
  status: string;
}

const SOCKET_SERVER_URL =
  `${import.meta.env.VITE_API_URL}` || "http://localhost:3000";

export const useNotificationSender = (userId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socketInstance: Socket = io(SOCKET_SERVER_URL, {
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      // Join a room using the userId and use our defined type
      socketInstance.emit("join-room", userId, (response: JoinRoomResponse) => {
        console.log("Join-room response:", response);
      });
    });

    setSocket(socketInstance);

    // Cleanup when the hook unmounts or userId changes
    return () => {
      socketInstance.emit("leave-room", userId);
      socketInstance.disconnect();
    };
  }, [userId]);

  // Function to send a notification using the socket connection
  const sendNotification = (notificationData: NotificationData) => {
    if (!socket) {
      console.warn("Socket is not connected.");
      return;
    }
    socket.emit("send-notification", notificationData);
  };

  return { sendNotification, socket };
};
