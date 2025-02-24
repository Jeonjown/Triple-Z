// models/Notification.ts
import mongoose, { Schema, Document } from "mongoose";
import { notificationDB } from "../db";

export interface INotification extends Document {
  title: string;
  description: string;
  userId: mongoose.Types.ObjectId;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Notification = notificationDB.model<INotification>(
  "Notification",
  NotificationSchema
);
