// controllers/notificationController.ts
import { Request, Response, NextFunction } from "express";
import { Notification } from "../models/notificationsModel";
import User from "../models/userModel";
import { createError } from "../utils/createError";

// Create a new notification
export const createNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { title, description, userId, redirectUrl } = req.body;
  if (!title || !description || !userId || !redirectUrl) {
    return next(createError("Missing required fields", 400));
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
    return next(createError("Error saving notification", 500));
  }
};

// Get notifications for a user
export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Optionally, you may want to use req.params instead of req.body for userId
  const { userId } = req.body;
  if (!userId) {
    return next(createError("Missing userId in request body", 400));
  }
  try {
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return next(createError("Error fetching notifications", 500));
  }
};

// Mark a single notification as read
export const readNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  try {
    const deleteDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { read: true, deleteAt: deleteDate },
      { new: true }
    );
    if (!updatedNotification) {
      return next(createError("Notification not found", 404));
    }
    res.json(updatedNotification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return next(createError("Error marking notification as read", 500));
  }
};

// Mark all notifications as read
export const readAllNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Here we assume the userId is provided as a route parameter.
    const { userId } = req.params;
    const deleteDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true, deleteAt: deleteDate }
    );
    if (result.modifiedCount === 0) {
      return next(createError("No unread notifications found", 404));
    }
    res.json({ message: "All notifications marked as read." });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return next(createError("Failed to mark notifications as read", 500));
  }
};

// Create a notification for all admin users
export const createAdminNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { title, description, redirectUrl } = req.body;
  if (!title || !description || !redirectUrl) {
    return next(createError("Missing required fields", 400));
  }
  try {
    // Find all users with the admin role
    const admins = await User.find({ role: "admin" });
    if (!admins || admins.length === 0) {
      return next(createError("No admin users found", 404));
    }
    // Create a notification for each admin user
    const notifications = await Promise.all(
      admins.map((adminUser) =>
        Notification.create({
          title,
          description,
          userId: adminUser._id,
          redirectUrl,
        })
      )
    );
    res.status(201).json({ notifications });
  } catch (error) {
    console.error("Error saving admin notifications:", error);
    return next(createError("Error saving admin notifications", 500));
  }
};
