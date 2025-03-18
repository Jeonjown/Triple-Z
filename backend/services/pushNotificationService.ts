import admin from "../utils/firebase";

// Function to send a notification to a single device using a data-only payload
export async function sendPushNotification({
  token,
  title,
  body,
  icon,
  click_action,
}: {
  token: string;
  title: string;
  body: string;
  icon?: string;
  click_action?: string;
}): Promise<void> {
  const message = {
    token,
    data: {
      title,
      body,
      icon: icon || "/triple-z-logo.png",
      click_action: click_action || "/",
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);
  } catch (error: unknown) {
    console.error("Error sending notification:", error);
    throw error;
  }
}
