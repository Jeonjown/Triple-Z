import admin from "../utils/firebase";

// Function to send a notification to a single device using a data-only payload
export async function sendMulticastPushNotification({
  tokens,
  title,
  body,
  icon,
  click_action,
}: {
  tokens: string[];
  title: string;
  body: string;
  icon?: string;
  click_action?: string;
}): Promise<void> {
  const message = {
    tokens, // Array of token strings
    data: {
      title,
      body,
      icon: icon || "/triple-z-logo.svg",
      click_action: click_action || "/",
    },
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log("Notification sent successfully:", response);
  } catch (error: unknown) {
    console.error("Error sending notification:", error);
    throw error;
  }
}
