import { Request, Response } from "express";
import webpush from "web-push";
import { ISubscription, Subscription } from "../models/subscriptionModel";

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const email = process.env.VAPID_EMAIL;

if (!publicKey || !privateKey || !email) {
  throw new Error("Missing VAPID keys in environment variables.");
}

webpush.setVapidDetails(`mailto:${email}`, publicKey, privateKey);

// Save the subscription dynamically.
export const subscribe = async (req: Request, res: Response): Promise<void> => {
  const subscriptionData = req.body;
  console.log("Subscription Data:", subscriptionData);

  if (!subscriptionData.userId) {
    res.status(400).json({ message: "UserId is required" });
    return;
  }

  try {
    // Look for an existing subscription by userId
    const existing = await Subscription.findOne({
      userId: subscriptionData.userId,
    });
    if (existing) {
      // If the endpoint changed, update it (and keys/expirationTime if needed)
      if (existing.endpoint !== subscriptionData.endpoint) {
        existing.endpoint = subscriptionData.endpoint;
        existing.expirationTime = subscriptionData.expirationTime;
        existing.keys = subscriptionData.keys;
        await existing.save();
      }
      res.sendStatus(200);
      return;
    }
    // Create new subscription if not found
    await Subscription.create(subscriptionData);
    res.sendStatus(200);
  } catch (error) {
    console.error("Subscription error:", error);
    res.sendStatus(500);
  }
};

// Send a dynamic notification based on request payload.
export const sendNotificationToAll = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Expect title, description, and userId in the request body
  const { title, description, userId } = req.body;
  // Include userId in the notification payload
  const payload = JSON.stringify({
    title,
    description,
    image: "/logo.png",
    userId,
  });

  try {
    const subscriptions: ISubscription[] = await Subscription.find({});
    if (subscriptions.length === 0) {
      res.status(400).json({ message: "No subscriptions found" });
      return;
    }
    // Send notifications to all subscriptions
    const sendPromises = subscriptions.map((sub: ISubscription) =>
      webpush.sendNotification(sub, payload).catch((error: unknown) => {
        console.error(
          `Error sending notification for subscription ${sub.endpoint}:`,
          error
        );
      })
    );
    await Promise.all(sendPromises);
    res.status(200).json({ message: "Notification sent!" });
  } catch (err: unknown) {
    console.error("Notification error:", err);
    res.status(500).json({ message: "Error sending notification" });
  }
};

export const sendNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Expect the userId along with title and description in the request body
  const { userId, title, description } = req.body;
  const payload = JSON.stringify({ title, description, image: "/logo.png" });

  try {
    // Filter subscriptions by the provided userId
    const subscriptions: ISubscription[] = await Subscription.find({ userId });

    if (subscriptions.length === 0) {
      res.status(400).json({ message: "No subscriptions found for this user" });
      return;
    }

    // Send notifications to all subscriptions for the user
    const sendPromises = subscriptions.map((sub: ISubscription) =>
      webpush.sendNotification(sub, payload).catch((error: unknown) => {
        console.error(`Error sending notification for ${sub.endpoint}:`, error);
      })
    );
    await Promise.all(sendPromises);

    res.status(200).json({ message: "Notification sent!" });
  } catch (err: unknown) {
    console.error("Notification error:", err);
    res.status(500).json({ message: "Error sending notification" });
  }
};
