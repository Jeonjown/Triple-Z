// models/notificationsModel.ts
import mongoose, { Schema, Document } from "mongoose";
import { notificationDB } from "../db";

export interface INotification extends Document {
  title: string;
  description: string;
  userId: mongoose.Types.ObjectId;
  read: boolean;
  redirectUrl: string;
  createdAt: Date;
}

export interface INotificationInput {
  title: string;
  description: string;
  userId: mongoose.Types.ObjectId;
  redirectUrl: string;
}

const NotificationSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  read: { type: Boolean, default: false },
  redirectUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: null, index: { expireAfterSeconds: 0 } },
});

export const Notification = notificationDB.model<INotification>(
  "Notification",
  NotificationSchema
);
