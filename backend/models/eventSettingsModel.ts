import mongoose from "mongoose";
import { reservationDB } from "../db";

const eventSettingsSchema = new mongoose.Schema(
  {
    // For  event reservations:
    eventReservationLimit: { type: Number, required: true },
    eventMinDaysPrior: { type: Number, required: true, min: 0 },
    eventFee: { type: Number, required: true },
    eventMinGuests: { type: Number, required: true, min: 1 },
    eventMaxGuests: { type: Number, required: true },
    eventTermsofService: { type: String },
    eventMinPackageOrder: { type: Number, required: true, default: 0 },
    eventCorkageFee: { type: Number, required: true, min: 0 },

    // For group reservations:
    groupMinReservation: { type: Number, required: true, min: 1 },
    groupMaxReservation: { type: Number, required: true },
    groupMaxGuestsPerTable: { type: Number, required: true, default: 6 },
    groupMinDaysPrior: { type: Number, required: true, min: 0 },
    groupReservationLimit: { type: Number, required: true },
    groupMaxTablesPerDay: { type: Number, required: true, min: 0 },

    openingHours: { type: String, required: true },
    closingHours: { type: String, required: true },
  },
  { timestamps: true }
);

export const EventSettings = reservationDB.model(
  "EventSettings",
  eventSettingsSchema
);
