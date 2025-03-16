// src/routes/notificationRoutes.ts
import { Router } from "express";
import { sendPushNotificationController } from "../controllers/pushNotificationController";

const router = Router();

// Define the route for sending notifications
router.post("/send", sendPushNotificationController);

export default router;
