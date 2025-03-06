import mongoose from "mongoose";
import { reservationDB } from "../db";

const eventSettingsSchema = new mongoose.Schema(
  {
    eventReservationLimit: { type: Number, required: true },
    eventMinDaysPrior: { type: Number, required: true, min: 0 },
    eventFee: { type: Number, required: true },
    eventMinGuests: { type: Number, required: true, min: 0 },

    groupReservationLimit: { type: Number, required: true },
    groupMinDaysPrior: { type: Number, required: true, min: 0 },
    groupMaxTables: { type: Number, min: 0 },
    groupAvailableTables: { type: Number, min: 0 },

    openingHours: { type: String, required: true },
    closingHours: { type: String, required: true },
  },
  { timestamps: true }
);

// Register the EventReservation model with the reservationDB connection
export const EventSettings = reservationDB.model(
  "EventSettings",
  eventSettingsSchema
);
