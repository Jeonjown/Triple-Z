import admin from "../utils/firebase";

// Function to send a notification to a single device
export async function sendTestNotification(token: string): Promise<void> {
  // Build the message object with device token & notification payload
  const message = {
    token,
    notification: {
      title: "Test Notification",
      body: "This is a test notification from Firebase Admin",
    },
  };

  try {
    // Use admin.messaging().send() to send the message
    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);
  } catch (error: unknown) {
    console.error("Error sending notification:", error);
    throw error; // let the controller handle the error
  }
}
