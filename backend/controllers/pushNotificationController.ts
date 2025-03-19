// src/controllers/notificationController.ts
import { Request, Response, NextFunction } from "express";
import { createError } from "../utils/createError";

import { sendPushNotificationToAdmins } from "../services/adminPushNotificationService";
import Subscription from "../models/subscriptionModel";
import { sendMulticastPushNotification } from "../services/pushNotificationService";

interface PushNotificationRequestBody {
  userId: string;
  title: string;
  body: string;
  icon?: string;
  click_action?: string;
}

export async function sendPushNotificationToUser(
  req: Request<{}, {}, PushNotificationRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { userId, title, body, icon, click_action } = req.body;

  // Validate required fields
  if (!userId || !title || !body) {
    return next(createError("userId, title, and body are required", 400));
  }

  try {
    // Find the subscription document for the given userId
    const subscription = await Subscription.findOne({ userId });
    if (!subscription || subscription.tokens.length === 0) {
      return next(createError("No tokens found for this user", 404));
    }

    // Extract token strings from the tokens array
    const tokens = subscription.tokens.map((tokenObj) => tokenObj.token);

    // Send notification using multicast
    await sendMulticastPushNotification({
      tokens,
      title,
      body,
      icon,
      click_action,
    });
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
