import mongoose from "mongoose";
import { reservationDB } from "../db";

const eventSettingsSchema = new mongoose.Schema(
  {
    eventReservationLimit: { type: Number, required: true },
    minDaysPrior: { type: Number, required: true, min: 0 },
    minGuests: { type: Number, required: true, min: 0 },
    groupReservationLimit: { type: Number, required: true },
    maxTables: { type: Number, min: 0 },
    openingHours: { type: String, required: true },
    closingHours: { type: String, required: true },
    eventFee: { type: Number, required: true },
  },
  { timestamps: true }
);

// Register the EventReservation model with the reservationDB connection
export const EventSettings = reservationDB.model(
  "EventSettings",
  eventSettingsSchema
);
