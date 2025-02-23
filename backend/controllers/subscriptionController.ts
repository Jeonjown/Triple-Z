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
    // Check if a subscription with the same endpoint already exists.
    const existing = await Subscription.findOne({
      endpoint: subscriptionData.endpoint,
    });
    if (existing) {
      // Subscription exists; optionally update it if needed.
      res.sendStatus(200); // Or return a message indicating it's already subscribed.
      return;
    }
    // No duplicate found; create a new subscription.
    await Subscription.create(subscriptionData);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
};

// Send a dynamic notification based on request payload.
export const sendNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Expect dynamic data from the request body.
  const { title, body } = req.body;
  const payload = JSON.stringify({ title, body });

  try {
    const subscriptions: ISubscription[] = await Subscription.find({});
    if (subscriptions.length === 0) {
      res.status(400).json({ message: "No subscriptions found" });
      return;
    }
    subscriptions.forEach((sub: ISubscription) => {
      webpush.sendNotification(sub, payload).catch((error: unknown) => {
        console.error("Error sending notification:", error);
      });
    });
    res.status(200).json({ message: "Notification sent!" });
  } catch (err: unknown) {
    console.error("Notification error:", err);
    res.status(500).json({ error: "Error sending notification" });
  }
};
