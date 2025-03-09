import { INotification, Notification } from "../../models/notificationsModel";

export const saveNotificationToDB = async (notificationData: INotification) => {
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
