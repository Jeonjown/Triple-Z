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

  if (
    !subscriptionData.userId ||
    !subscriptionData.endpoint ||
    !subscriptionData.keys
  ) {
    res.status(400).json({ message: "Invalid subscription data" });
    return;
  }

  try {
    // Check if the subscription exists by endpoint.
    const existing = await Subscription.findOne({
      endpoint: subscriptionData.endpoint,
    });

    if (existing) {
      // Update the existing subscription with new data.
      Object.assign(existing, subscriptionData);
      await existing.save();
    } else {
      // Create a new subscription record.
      await Subscription.create(subscriptionData);
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("Subscription error:", error);
    res.sendStatus(500);
  }
};

export const unsubscribe = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { endpoint } = req.body;
  if (!endpoint) {
    res.status(400).json({ message: "Endpoint is required" });
    return;
  }
  try {
    await Subscription.deleteOne({ endpoint });
    res.sendStatus(200);
  } catch (error) {
    console.error("Unsubscribe error:", error);
    res.sendStatus(500);
  }
};

// Send a notification to all subscribers.
export const sendNotificationToAll = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, description, userId } = req.body;
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

    const sendPromises = subscriptions.map(async (sub: ISubscription) => {
      try {
        await webpush.sendNotification(sub, payload);
      } catch (error: any) {
        console.error(`Error sending notification for ${sub.endpoint}:`, error);
        if (error.statusCode === 410) {
          await Subscription.deleteOne({ endpoint: sub.endpoint });
          console.log(`Subscription removed: ${sub.endpoint}`);
        }
      }
    });
    await Promise.all(sendPromises);

    res.status(200).json({ message: "Notification sent!" });
  } catch (error) {
    console.error("Notification error:", error);
    res.status(500).json({ message: "Error sending notification" });
  }
};

// Send a notification to a specific user.
export const sendNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, title, description } = req.body;
  const payload = JSON.stringify({ title, description, image: "/logo.png" });

  try {
    const subscriptions: ISubscription[] = await Subscription.find({ userId });
    if (subscriptions.length === 0) {
      res.status(400).json({ message: "No subscriptions found for this user" });
      return;
    }

    const sendPromises = subscriptions.map(async (sub: ISubscription) => {
      try {
        await webpush.sendNotification(sub, payload);
      } catch (error: any) {
        console.error(`Error sending notification for ${sub.endpoint}:`, error);
        if (error.statusCode === 410) {
          await Subscription.deleteOne({ endpoint: sub.endpoint });
          console.log(`Subscription removed: ${sub.endpoint}`);
        }
      }
    });
    await Promise.all(sendPromises);

    res.status(200).json({ message: "Notification sent!" });
  } catch (error) {
    console.error("Notification error:", error);
    res.status(500).json({ message: "Error sending notification" });
  }
};
