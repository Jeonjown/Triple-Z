import { Request, Response, NextFunction } from "express";
import { createError } from "../utils/createError";
import admin from "../utils/firebase"; // Ensure this exports the full Firebase Admin SDK

// Explicitly type the request body to have a 'token' property
export async function subscribeToAdminsTopic(
  req: Request<{}, {}, { token: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { token } = req.body;
  if (!token) return next(createError("Token is required", 400));

  try {
    // Subscribe the token to the "admins" topic using Firebase Admin's messaging service
    const response = await admin
      .messaging()
      .subscribeToTopic([token], "admins");
    res.status(200).json({ message: "Subscribed to admins topic", response });
  } catch (error: unknown) {
    console.error("Error subscribing token to topic:", error);
    return next(createError("Failed to subscribe token to topic", 500));
  }
}

export async function unsubscribeFromAdminsTopic(
  req: Request<{}, {}, { token: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { token } = req.body;
  if (!token) return next(createError("Token is required", 400));

  try {
    const response = await admin
      .messaging()
      .unsubscribeFromTopic([token], "admins");
    res
      .status(200)
      .json({ message: "Unsubscribed from admin notifications", response });
  } catch (error: unknown) {
    console.error("Error unsubscribing token from topic:", error);
    return next(createError("Failed to unsubscribe token from topic", 500));
  }
}
