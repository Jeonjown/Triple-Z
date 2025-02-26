// server.ts (or index.ts)
import express, { NextFunction, Response, Request } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import passport from "./config/passport";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import menuRoutes from "./routes/menuRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import menuItemRoutes from "./routes/menuItemRoutes";
import subcategoryRoutes from "./routes/subcategoryRoutes";
import { ResponseError } from "./utils/createError";
import eventReservationRoutes from "./routes/eventReservationRoutes";
import eventSettingsRoutes from "./routes/eventSettingsRoutes";
import subscriptionRoutes from "./routes/subscriptionRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import messageRoutes from "./routes/messageRoutes";
import { Message } from "./models/messageModel";
import User from "./models/userModel";
import mongoose from "mongoose";

const server = express();

// Middleware setup
server.use(express.json());
server.use(passport.initialize());
server.use(express.urlencoded({ extended: true, limit: "10mb" }));
server.use(cookieParser());
server.use(express.json({ limit: "10mb" }));
server.use(
  cors({
    origin: ["http://localhost:5173", "https://triple-z.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);

// Route handling
server.use("/api/auth", authRoutes);
server.use("/api/users", userRoutes);
server.use("/api/menu", menuRoutes);
server.use("/api/menu/menu-items", menuItemRoutes);
server.use("/api/menu/categories", categoryRoutes);
server.use("/api/menu/categories", subcategoryRoutes);
server.use("/api/menu/events/reservations", eventReservationRoutes);
server.use("/api/menu/events/settings", eventSettingsRoutes);
server.use("/api/subscriptions", subscriptionRoutes);
server.use("/api/notifications", notificationRoutes);
server.use("/api/messages", messageRoutes);

server.use(
  (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
    res
      .status(err.status || 500)
      .json({ error: err.message || "Internal Server Error" });
  }
);

const httpServer = http.createServer(server);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "https://triple-z.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
});

// Define an interface for socket messages
interface SocketMessage {
  text: string;
  sender: "user" | "admin";
  roomId: string;
  userId: string;
}

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("join-room", (roomId: string) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("send-message", async (messageData: SocketMessage) => {
    try {
      let username: string;
      let email: string;

      // Check if messageData.userId is a valid ObjectId before attempting lookup.
      if (mongoose.Types.ObjectId.isValid(messageData.userId)) {
        const user = await User.findById(messageData.userId);
        if (user) {
          username = user.username;
          email = user.email;
        } else {
          username = "Guest";
          email = "No email";
        }
      } else {
        // For guest messages, default to guest values.
        username = "Guest";
        email = "No email";
      }

      // Create the message with embedded username and email.
      const savedMessage = await Message.create({
        text: messageData.text,
        sender: messageData.sender,
        roomId: messageData.roomId,
        userId: messageData.userId,
        username: username,
        email: email,
      });

      console.log("Message saved:", savedMessage);
      io.to(messageData.roomId).emit("receive-message", savedMessage);
    } catch (error: any) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("admin-message", async (messageData: SocketMessage) => {
    try {
      // Save the admin message to MongoDB.
      const savedMessage = await Message.create({
        text: messageData.text,
        sender: messageData.sender,
        roomId: messageData.roomId,
        userId: messageData.userId,
      });
      console.log("Admin message saved:", savedMessage);
      io.to(messageData.roomId).emit("receive-message", messageData);
    } catch (error: any) {
      console.error("Error saving admin message:", error);
    }
  });
});

const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
