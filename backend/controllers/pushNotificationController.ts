// src/controllers/notificationController.ts
import { Request, Response, NextFunction } from "express";
import { createError } from "../utils/createError";
import { sendTestNotification } from "../services/pushNotificationService";

export async function sendPushNotificationController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { token } = req.body;
  if (!token) {
    return next(createError("Token is required", 400));
  }

  try {
    await sendTestNotification(token);
    res.json({ message: "Notification sent successfully" });
  } catch (error: unknown) {
    console.error("Error in controller:", error);
    return next(createError("Failed to send notification", 500));
  }
}
