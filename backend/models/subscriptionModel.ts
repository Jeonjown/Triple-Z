// models/Subscription.ts
import mongoose, { Schema, Document } from "mongoose";
import { subscriptionDB } from "../db";

// Define an interface for push subscriptions
export interface ISubscription extends Document {
  endpoint: string;
  expirationTime?: number;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// Define the subscription schema based on the PushSubscription structure
const SubscriptionSchema: Schema<ISubscription> = new Schema({
  endpoint: { type: String, required: true },
  expirationTime: { type: Number, default: null },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  },
});

// Export the model (using your existing connection if needed)
export const Subscription = subscriptionDB.model<ISubscription>(
  "Subscription",
  SubscriptionSchema
);
