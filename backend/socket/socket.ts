// socket.ts
import { Server as SocketIOServer } from "socket.io";
import { Notification } from "../models/notificationsModel";
import {
  saveAdminMessage,
  saveUserMessage,
  SocketMessage,
} from "./services/messageService";
import {
  createAdminNotifications,
  saveNotificationToDB,
} from "./services/notificationService";
import mongoose from "mongoose";

export let io: SocketIOServer;

export const initSocket = (httpServer: any) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "https://triple-z.vercel.app"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join-room", (roomId: string, callback) => {
      socket.join(roomId);
      if (callback) callback({ status: "joined" });
    });

    // Other listeners (get-notifications, leave-room, etc.) remain unchanged

    // --- Updated "send-message" event for user messages ---
    socket.on("send-message", async (messageData: SocketMessage) => {
      try {
        const savedMessage = await saveUserMessage(messageData);
        // Update chat window for all participants in the room
        io.to(messageData.roomId).emit("receive-message", savedMessage);

        // Create notifications for admin users (the receiver)
        // Build the payload without a userId since we create one for each admin.
        const notificationPayload = {
          title: "New Message Received",
          description: `Message from user: ${savedMessage.text}`,
          redirectUrl: "/admin-chat",
        };
        // Create a notification for each admin
        const adminNotifications = await createAdminNotifications(
          notificationPayload
        );
        // Emit the notification only to admin clients (targeted by their userId)
        adminNotifications.forEach((notif) => {
          io.to(notif.userId.toString()).emit("notification", notif);
        });
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    // --- Updated "admin-message" event for admin messages ---
    socket.on("admin-message", async (messageData: SocketMessage) => {
      try {
        const savedMessage = await saveAdminMessage(messageData);
        // Update chat window for all participants in the room
        io.to(messageData.roomId).emit("receive-message", savedMessage);

        // Notify only the user (receiver)
        // Here, savedMessage.userId should refer to the user who originally started the chat.
        if (savedMessage.userId) {
          const notificationPayload = {
            title: "New Message Received",
            description: `Message from admin: ${savedMessage.text}`,
            redirectUrl: "/", // Update this path as needed
            userId: new mongoose.Types.ObjectId(savedMessage.userId),
          };
          const savedNotification = await saveNotificationToDB(
            notificationPayload
          );
          io.to(savedNotification.userId.toString()).emit(
            "notification",
            savedNotification
          );
        }
      } catch (error) {
        console.error("Error saving admin message:", error);
      }
    });

    // The rest of your socket listeners (send-notification, send-admin-notification, etc.)
    // You can remove or adjust any events (such as "send-admin-notification") that are now redundant.

    socket.on("leave-room", (roomId: string) => {
      socket.leave(roomId);
    });
  });
};
