import mongoose from "mongoose";
import { reservationDB } from "../db";

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // reference the User model
    date: { type: Date, required: true },
    fullName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    guests: { type: Number, required: true, min: 24 },
    eventType: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Register the EventReservation model with the reservationDB connection
export const EventReservation = reservationDB.model(
  "EventReservation",
  reservationSchema
);
