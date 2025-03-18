// src/controllers/notificationController.ts
import { Request, Response, NextFunction } from "express";
import { createError } from "../utils/createError";
import { sendPushNotification } from "../services/pushNotificationService";
import { sendPushNotificationToAdmins } from "../services/adminPushNotificationService";

export async function sendPushNotificationToUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { token, title, body, icon, click_action } = req.body;

  // Validate required fields
  if (!token || !title || !body) {
    return next(createError("Token, title, and body are required", 400));
  }

  try {
    await sendPushNotification({ token, title, body, icon, click_action });
    res.json({ message: "Notification sent successfully" });
  } catch (error: unknown) {
    console.error("Error in controller:", error);
    return next(createError("Failed to send notification", 500));
  }
}

export const notifyAdmins = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, body } = req.body;

    // Validate input
    if (!title || !body) {
      res.status(400).json({ message: "Title and body are required." });
      return;
    }

    const notification = { title, body };

    await sendPushNotificationToAdmins(notification);
    res.status(200).json({ message: "Admin notification sent successfully" });
  } catch (error) {
    console.error("Error notifying admins:", error);
    res
      .status(500)
      .json({ message: "Failed to send admin notification", error });
  }
};
