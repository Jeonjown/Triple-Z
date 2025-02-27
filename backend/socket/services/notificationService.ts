export interface Notification {
  id: string;
  roomId: string;
  message: string;
  // Additional fields can be added here if needed
  createdAt: Date;
}

// In-memory store for notifications (simulate database)
const notifications: Notification[] = [];

// Function to save a notification
export const saveNotification = async (
  notificationData: Omit<Notification, "id" | "createdAt">
): Promise<Notification> => {
  // Generate a unique id and set creation time
  const id = generateUniqueId();
  const createdAt = new Date();

  // Create the new notification object
  const newNotification: Notification = {
    id,
    createdAt,
    ...notificationData,
  };

  // Simulate saving the notification
  notifications.push(newNotification);

  // Return the saved notification
  return newNotification;
};

// Helper function to generate a unique identifier
const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};
