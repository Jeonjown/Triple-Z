import { Server as SocketIOServer } from "socket.io";
import {
  saveAdminMessage,
  saveUserMessage,
  SocketMessage,
} from "./services/messageService";
import { saveNotification } from "./services/notificationService";

export const initSocket = (httpServer: any) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "https://triple-z.vercel.app"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("join-room", (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on("send-message", async (messageData: SocketMessage) => {
      try {
        const savedMessage = await saveUserMessage(messageData);
        console.log("Message saved:", savedMessage);
        io.to(messageData.roomId).emit("receive-message", savedMessage);
      } catch (error: any) {
        console.error("Error saving message:", error);
      }
    });

    socket.on("admin-message", async (messageData: SocketMessage) => {
      try {
        const savedMessage = await saveAdminMessage(messageData);
        console.log("Admin message saved:", savedMessage);
        io.to(messageData.roomId).emit("receive-message", savedMessage);
      } catch (error: any) {
        console.error("Error saving admin message:", error);
      }
    });

    socket.on("send-notification", async (notificationData: any) => {
      try {
        const savedNotification = await saveNotification(notificationData);
        console.log("Notification saved:", savedNotification);
        // Emit the notification to a specific room or user
        io.to(notificationData.roomId).emit(
          "receive-notification",
          savedNotification
        );
      } catch (error: any) {
        console.error("Error saving notification:", error);
      }
    });
  });
};
