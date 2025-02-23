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
  try {
    const existing = await Subscription.findOne({
      endpoint: subscriptionData.endpoint,
    });
    if (existing) {
      res.sendStatus(200);
      return;
    }
    await Subscription.create(subscriptionData);
    res.sendStatus(200);
  } catch (error) {
    console.error("Subscription error:", error);
    res.sendStatus(500);
  }
};

// Send a dynamic notification based on request payload.
export const sendNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Use description instead of body to match client payload
  const { title, description } = req.body;
  // Always include your logo as the image.
  const payload = JSON.stringify({ title, description, image: "/logo.png" });

  try {
    const subscriptions: ISubscription[] = await Subscription.find({});
    if (subscriptions.length === 0) {
      res.status(400).json({ message: "No subscriptions found" });
      return;
    }
    // Send notifications to all subscriptions and wait for them.
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
