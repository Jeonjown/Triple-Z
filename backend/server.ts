// server.ts
import express, { NextFunction, Response, Request } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import helmet from "helmet";
// Remove permissionsPolicy from Helmet if it's causing issues and set it manually if needed.
import { ResponseError } from "./utils/createError";
import passport from "./config/passport";
import bodyParser from "body-parser";

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
import unavailableDateRoutes from "./routes/unavailableDateRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import webhookRoutes from "./routes/webhookRoutes";
import http from "http";
import { initSocket } from "./socket/socket";
import analyticsRoutes from "./routes/analyticsRoutes";

const server = express();

// --- Security Headers Middleware via Helmet ---
server.use(
  helmet({
    // Configure Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    // Set Referrer-Policy header
    referrerPolicy: { policy: "no-referrer" },
  })
);

// Helmet also provides these headers:
server.use(helmet.frameguard({ action: "sameorigin" }));
server.use(helmet.noSniff());
// Set Cross-Origin-Resource-Policy
server.use(helmet.crossOriginResourcePolicy({ policy: "same-site" }));

// --- Manual Middleware for Missing Security Headers ---
// In case any header is missing, we add them manually.
server.use((req: Request, res: Response, next: NextFunction) => {
  // Referrer-Policy header (if not already set)
  if (!res.getHeader("Referrer-Policy")) {
    res.setHeader("Referrer-Policy", "no-referrer");
  }
  // X-Content-Type-Options header
  if (!res.getHeader("X-Content-Type-Options")) {
    res.setHeader("X-Content-Type-Options", "nosniff");
  }
  // Content-Security-Policy header
  if (!res.getHeader("Content-Security-Policy")) {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self' data:; object-src 'none'; upgrade-insecure-requests;"
    );
  }
  // Permissions-Policy header: adjust the features as needed
  if (!res.getHeader("Permissions-Policy")) {
    res.setHeader(
      "Permissions-Policy",
      "geolocation=(), camera=(), microphone=()"
    );
  }
  next();
});

// --- Standard Middleware ---
server.use(express.json());
server.use(
  bodyParser.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    },
  })
);
server.use(express.urlencoded({ extended: true, limit: "10mb" }));
server.use(cookieParser());

// CORS configuration
server.use(
  cors({
    origin: [
      "http://localhost:5173",
      // "https://triple-z.vercel.app",
      "https://www.triplez.shop",
    ],
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
server.use("/api/unavailable-dates", unavailableDateRoutes);
server.use("/api/analytics", analyticsRoutes);
server.use("/api/payment", paymentRoutes);
server.use("/api/webhook", webhookRoutes);

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
