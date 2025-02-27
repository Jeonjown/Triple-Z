// controllers/notificationController.ts
import { Request, Response } from "express";
import { Notification } from "../models/notificationsModel";
import User from "../models/userModel";

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

export const createAdminNotification = async (
  title: string,
  description: string
): Promise<any> => {
  if (!title || !description) {
    throw new Error("Missing required fields");
  }
  try {
    // Find all users with the role "admin"
    const adminUsers = await User.find({ role: "admin" });
    // Create a notification for each admin user
    const notifications = await Promise.all(
      adminUsers.map(async (admin) => {
        return await Notification.create({
          title,
          description,
          userId: admin._id,
        });
      })
    );
    return notifications;
  } catch (error) {
    console.error("Error saving admin notifications:", error);
    throw new Error("Error saving admin notifications");
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
