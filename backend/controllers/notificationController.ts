// controllers/notificationController.ts
import { Request, Response } from "express";
import { Notification } from "../models/notificationsModel";

export const createNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, description, userId } = req.body;
  if (!title || !description || !userId) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }
  try {
    const notification = await Notification.create({
      title,
      description,
      userId,
    });
    res.status(201).json({ notification });
  } catch (error) {
    console.error("Error saving notification:", error);
    res.status(500).json({ message: "Error saving notification" });
  }
};

export const getNotifications = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.body;
  console.log("Received userId:", userId);

  if (!userId) {
    res.status(400).json({ message: "Missing userId in request body" });
    return;
  }

  try {
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};
