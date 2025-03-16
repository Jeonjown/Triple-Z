//adminPushNotificationService.ts

import admin from "../utils/firebase";

// Function to send a notification to the "admins" topic
export async function sendNotificationToAdmins(notification: {
  title: string;
  body: string;
}): Promise<void> {
  const message = {
    topic: "admins",
    notification: {
      title: notification.title,
      body: notification.body,
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Admin notification sent successfully:", response);
  } catch (error: unknown) {
    console.error("Error sending admin notification:", error);
    throw error;
  }
}
