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
      origin: [
        "http://localhost:5173",
        "https://triple-z.vercel.app",
        "https://triplez.shop",
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join-room", (roomId: string, callback) => {
      socket.join(roomId);
      if (callback) callback({ status: "joined" });
    });

    // --- Updated "send-message" event for user messages ---
    socket.on("send-message", async (messageData: SocketMessage) => {
      try {
        const savedMessage = await saveUserMessage(messageData);
        // Update chat window for all participants in the room
        io.to(messageData.roomId).emit("receive-message", savedMessage);

        // Create notifications for admin users (the receiver)
        const notificationPayload = {
          title: "New Message Received",
          description: `Message from user: ${savedMessage.text}`,
          redirectUrl: "/admin-chat",
        };
        const adminNotifications = await createAdminNotifications(
          notificationPayload
        );
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
        io.to(messageData.roomId).emit("receive-message", savedMessage);

        // Notify only the user (receiver)
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

    // --- New "new-reservation-notification" event ---
    socket.on("send-admins-notification", async (payload) => {
      try {
        // Use the payload received from the client.
        const notificationPayload = {
          title: payload.title || "New Reservation Received",
          description: payload.body, // Use 'body' property from client payload
          redirectUrl: payload.redirectUrl || "/admin-reservations",
        };
        const adminNotifications = await createAdminNotifications(
          notificationPayload
        );
        adminNotifications.forEach((notif) => {
          io.to(notif.userId.toString()).emit("notification", notif);
        });
      } catch (error) {
        console.error("Error sending admin notification:", error);
      }
    });

    socket.on("leave-room", (roomId: string) => {
      socket.leave(roomId);
    });
  });
};
