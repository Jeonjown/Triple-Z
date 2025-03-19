// controllers/fcmController.ts
import { Request, Response, NextFunction } from "express";
import { createError } from "../utils/createError";
import admin from "../utils/firebase";
import Subscription from "../models/subscriptionModel";

// Define the expected request body for FCM token registration
interface FcmRegistrationRequestBody {
  token: string;
  user: {
    role: "admin" | "user";
    _id: string;
  };
  deviceInfo?: string;
}

export async function registerFcmToken(
  req: Request<{}, {}, FcmRegistrationRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { token, user, deviceInfo } = req.body;

  if (!token) {
    next(createError("Token is required", 400));
    return;
  }
  if (!user) {
    next(createError("User information is required", 400));
    return;
  }

  try {
    // Find subscription document by userId.
    let subscription = await Subscription.findOne({ userId: user._id });

    if (subscription) {
      // Check if the token already exists
      const tokenExists = subscription.tokens.some((t) => t.token === token);
      if (tokenExists) {
        // Optionally, you could update deviceInfo or createdAt if needed.
        res.status(200).json({
          message: "Token already registered",
          subscription,
        });
        return;
      } else {
        // Push the new token info if it does not exist
        subscription.tokens.push({ token, deviceInfo, createdAt: new Date() });
        await subscription.save();
      }
    } else {
      // No subscription for the user yet; create a new one.
      subscription = await Subscription.create({
        userId: user._id,
        tokens: [{ token, deviceInfo }],
      });
    }
    // For admin users, subscribe the token to the "admins" topic.
    if (user.role === "admin") {
      const response = await admin
        .messaging()
        .subscribeToTopic([token], "admins");
      res.status(200).json({
        message: "Subscribed to admins topic",
        response,
        subscription,
      });
      return;
    }

    res.status(200).json({
      message: "Token registered successfully",
      subscription,
    });
  } catch (error: unknown) {
    console.error("Error registering token:", error);
    next(createError("Failed to register token", 500));
    return;
  }
}

export async function removeFcmToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { token } = req.body;
  if (!token) {
    next(createError("Token is required", 400));
    return;
  }
  try {
    // Use $pull to remove the token from the tokens array.
    const subscription = await Subscription.findOneAndUpdate(
      { "tokens.token": token },
      { $pull: { tokens: { token } } },
      { new: true }
    );
    if (subscription) {
      res.status(200).json({ message: "FCM token removed successfully." });
    } else {
      res.status(404).json({ message: "Token not found." });
    }
    return;
  } catch (error: any) {
    console.error("Error removing token:", error);
    next(createError("Error removing token", 500));
    return;
  }
}
