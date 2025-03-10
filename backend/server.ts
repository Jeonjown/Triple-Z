// server.ts (or index.ts)
import express, { NextFunction, Response, Request } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import { ResponseError } from "./utils/createError";
import passport from "./config/passport";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import menuRoutes from "./routes/menuRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import menuItemRoutes from "./routes/menuItemRoutes";
import subcategoryRoutes from "./routes/subcategoryRoutes";
import eventReservationRoutes from "./routes/eventReservationRoutes";
import eventSettingsRoutes from "./routes/eventSettingsRoutes";
import subscriptionRoutes from "./routes/subscriptionRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import messageRoutes from "./routes/messageRoutes";

import http from "http";
import { initSocket } from "./socket/socket";
import groupReservationRoutes from "./routes/groupReservationRoutes";
import emailRoutes from "./routes/emailRoutes";
import blogRoutes from "./routes/blogRoutes";

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
server.use("/api/events/event-reservations", eventReservationRoutes);
server.use("/api/events/group-reservations", groupReservationRoutes);
server.use("/api/events/settings", eventSettingsRoutes);
server.use("/api/subscriptions", subscriptionRoutes);
server.use("/api/notifications", notificationRoutes);
server.use("/api/messages", messageRoutes);
server.use("/api/mail", emailRoutes);
server.use("/api/blogs", blogRoutes);

server.use(
  (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
    res
      .status(err.status || 500)
      .json({ error: err.message || "Internal Server Error" });
  }
);

const httpServer = http.createServer(server);
initSocket(httpServer);

const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
