// socket.ts
import { Server as SocketIOServer } from "socket.io";
import {
  saveAdminMessage,
  saveUserMessage,
  SocketMessage,
} from "./services/messageService";
import { saveNotificationToDB } from "./services/notificationService";

// Declare io so it can be used in other modules.
export let io: SocketIOServer;

export const initSocket = (httpServer: any) => {
  // Initialize the global io variable.
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "https://triple-z.vercel.app"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);
    socket.on("join-room", (roomId: string, callback) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
      if (callback) {
        callback({ status: "joined" });
      }
    });
    socket.on("send-notification", async (notificationData) => {
      console.log(notificationData);
      try {
        // Save the notification to the DB and capture the saved object
        const savedNotification = await saveNotificationToDB(notificationData);

        // Emit the saved notification (which includes _id) to the user
        io.to(notificationData.userId).emit("notification", savedNotification);

        console.log(`Notification sent to ${notificationData.userId}`);
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    });

    socket.on("send-message", async (messageData: SocketMessage) => {
      try {
        const savedMessage = await saveUserMessage(messageData);
        console.log("Message saved:", savedMessage);

        io.to(messageData.roomId).emit("receive-message", savedMessage);
        io.emit("new-user-message", savedMessage);
      } catch (error: any) {
        console.error("Error saving message:", error);
      }
    });

    socket.on("admin-message", async (messageData: SocketMessage) => {
      try {
        const savedMessage = await saveAdminMessage(messageData);
        console.log("Admin message saved:", savedMessage);

        io.emit("new-admin-message", savedMessage);
        io.to(messageData.roomId).emit("receive-message", savedMessage);
      } catch (error: any) {
        console.error("Error saving admin message:", error);
      }
    });

    socket.on("leave-room", (roomId: string) => {
      socket.leave(roomId);
      console.log(`Socket ${socket.id} left room ${roomId}`);
    });
  });
};
