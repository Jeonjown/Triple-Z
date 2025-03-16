// src/routes/notificationRoutes.ts
import { Router } from "express";
import { sendPushNotificationController } from "../controllers/pushnotificationController";

const router = Router();

// Define the route for sending notifications
router.post("/send", sendPushNotificationController);

export default router;
