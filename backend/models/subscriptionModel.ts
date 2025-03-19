// models/subscriptionModel.ts
import mongoose, { Document } from "mongoose";
import { subscriptionDB } from "../db";

export interface IToken {
  token: string;
  deviceInfo?: string;
  createdAt: Date;
}

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  tokens: IToken[];
}

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  deviceInfo: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  tokens: [tokenSchema],
});

const Subscription = subscriptionDB.model<ISubscription>(
  "Subscription",
  subscriptionSchema
);
export default Subscription;
