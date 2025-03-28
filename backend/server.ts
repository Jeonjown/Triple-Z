// server.ts
import express, { NextFunction, Response, Request } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import helmet from "helmet";
import { ResponseError } from "./utils/createError";
import passport from "./config/passport";

// Import routes
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import menuRoutes from "./routes/menuRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import menuItemRoutes from "./routes/menuItemRoutes";
import subcategoryRoutes from "./routes/subcategoryRoutes";
import eventReservationRoutes from "./routes/eventReservationRoutes";
import eventSettingsRoutes from "./routes/eventSettingsRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import messageRoutes from "./routes/messageRoutes";
import groupReservationRoutes from "./routes/groupReservationRoutes";
import emailRoutes from "./routes/emailRoutes";
import blogRoutes from "./routes/blogRoutes";
import pushNotificationRoutes from "./routes/pushNotificationRoutes";
import subscriptionRoutes from "./routes/subscriptionRoutes";
import permissionsPolicy from "permissions-policy";

import http from "http";
import { initSocket } from "./socket/socket";

const server = express();

// --- Security Headers Middleware via Helmet ---
// Configure Helmet to set a custom Content Security Policy and other headers
server.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        // Only allow resources from the same origin
        defaultSrc: ["'self'"],
        // Customize as needed; here we only allow self for scripts
        scriptSrc: ["'self'"],
        // Allow inline styles if necessary; otherwise remove "'unsafe-inline'" for stricter security
        styleSrc: ["'self'", "'unsafe-inline'"],
        // Allow images from the same origin and data URIs
        imgSrc: ["'self'", "data:"],
        // Restrict connections (AJAX, WebSocket, etc.) to self
        connectSrc: ["'self'"],
        // Allow fonts from self and data URIs
        fontSrc: ["'self'", "data:"],
        // Disallow plugins and objects
        objectSrc: ["'none'"],
        // Automatically upgrade insecure requests
        upgradeInsecureRequests: [],
      },
    },
    referrerPolicy: { policy: "no-referrer" },
  })
);

// Additional Helmet middleware (Helmet already disables X-Powered-By by default)
server.use(helmet.frameguard({ action: "sameorigin" }));
server.use(helmet.noSniff());
// Set Permissions-Policy to disable unneeded browser features
server.use(
  permissionsPolicy({
    features: {
      geolocation: [],
      camera: [],
      microphone: [],
    },
  })
);
// Optionally, set Cross-Origin-Resource-Policy to restrict resource embedding
server.use(helmet.crossOriginResourcePolicy({ policy: "same-site" }));

// --- Standard Middleware ---
server.use(express.json());
server.use(express.urlencoded({ extended: true, limit: "10mb" }));
server.use(cookieParser());

// CORS configuration
server.use(
  cors({
    origin: ["http://localhost:5173", "https://triple-z.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);

server.use(passport.initialize());

// --- Route Handling ---
server.use("/api/auth", authRoutes);
server.use("/api/users", userRoutes);
server.use("/api/menu", menuRoutes);
server.use("/api/menu/menu-items", menuItemRoutes);
server.use("/api/menu/categories", categoryRoutes);
server.use("/api/menu/categories", subcategoryRoutes);
server.use("/api/events/event-reservations", eventReservationRoutes);
server.use("/api/events/group-reservations", groupReservationRoutes);
server.use("/api/events/settings", eventSettingsRoutes);
server.use("/api/notifications", notificationRoutes);
server.use("/api/push-notifications", pushNotificationRoutes);
server.use("/api/messages", messageRoutes);
server.use("/api/mail", emailRoutes);
server.use("/api/blogs", blogRoutes);
server.use("/api/subscriptions", subscriptionRoutes);

// --- Error Handling Middleware ---
server.use(
  (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
    res
      .status(err.status || 500)
      .json({ error: err.message || "Internal Server Error" });
  }
);

// Create HTTP server and initialize sockets
const httpServer = http.createServer(server);
initSocket(httpServer);

const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
