// controllers/notificationController.ts
import { Request, Response } from "express";
import { Notification } from "../models/notificationsModel";

export const createNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, description, userId, redirectUrl } = req.body;
  if (!title || !description || !userId || !redirectUrl) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }
  try {
    const notification = await Notification.create({
      title,
      description,
      userId,
      redirectUrl,
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

export const readNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    // Calculate the deletion date (30 days from now)
    const deleteDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Find the notification by ID and update its "read" status and set deleteAt
    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { read: true, deleteAt: deleteDate },
      { new: true }
    );
    res.json(updatedNotification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Error marking notification as read" });
  }
};
