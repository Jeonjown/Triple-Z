import mongoose from "mongoose";
import { reservationDB } from "../db";

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    eventType: { type: String, required: true },
    partySize: { type: Number, required: true, min: 24 },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Canceled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// Register the EventReservation model with the reservationDB connection
export const EventReservation = reservationDB.model(
  "EventReservation",
  reservationSchema
);
