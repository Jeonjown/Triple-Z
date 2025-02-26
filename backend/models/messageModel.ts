// models/messageModel.ts
import { Document, Schema } from "mongoose";
import { messageDB } from "../db";

export interface IMessage extends Document {
  text: string;
  sender: "user" | "admin";
  roomId: string;
  userId: string;
  username?: string;
  email?: string;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema({
  text: { type: String, required: true },
  sender: { type: String, enum: ["user", "admin"], required: true },
  roomId: { type: String, required: true },
  userId: { type: String, default: null },
  username: { type: String },
  email: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Message = messageDB.model<IMessage>("Message", MessageSchema);
