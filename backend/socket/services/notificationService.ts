import {
  INotification,
  INotificationInput,
  Notification,
} from "../../models/notificationsModel";
import User from "../../models/userModel";

export const saveNotificationToDB = async (
  notificationData: INotificationInput
) => {
  const { title, description, userId, redirectUrl } = notificationData;

  // Validate required fields
  if (!title || !description || !userId || !redirectUrl) {
    throw new Error(
      "Missing required fields: title, description, userId, and redirectUrl are all required."
    );
  }

  try {
    const createdNotification = await Notification.create(notificationData);
    return createdNotification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

export const createAdminNotifications = async (
  notificationData: Omit<INotificationInput, "userId">
): Promise<INotification[]> => {
  const { title, description, redirectUrl } = notificationData;

  // Validate required fields
  if (!title || !description || !redirectUrl) {
    throw new Error(
      "Missing required fields: title, description, and redirectUrl are all required."
    );
  }

  // Query for admin users
  const admins = await User.find({ role: "admin" });
  if (!admins || admins.length === 0) {
    throw new Error("No admin users found");
  }

  // Create a notification for each admin user
  const createdNotifications = await Promise.all(
    admins.map((adminUser) => {
      const adminNotification: INotificationInput = {
        title,
        description,
        redirectUrl,
        userId: adminUser._id!, // Non-null assertion operator
      };
      return saveNotificationToDB(adminNotification);
    })
  );

  return createdNotifications;
};
