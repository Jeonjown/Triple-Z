// src/routes/notificationRoutes.ts
import { Router } from "express";
import {
  notifyAdmins,
  sendPushNotificationToUser,
} from "../controllers/pushNotificationController";

const router = Router();

// Define the route for sending notifications
router.post("/send", sendPushNotificationToUser);
router.post("/notify-admins", notifyAdmins);

export default router;
