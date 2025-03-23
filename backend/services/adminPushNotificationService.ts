import admin from "../utils/firebase";

// Function to send a notification to the "admins" topic using data-only payload
export async function sendPushNotificationToAdmins(notification: {
  title: string;
  body: string;
}): Promise<void> {
  const message = {
    topic: "admins",
    data: {
      title: notification.title,
      body: notification.body,
      icon: "/triple-z-logo.svg",
      click_action: "/",
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
