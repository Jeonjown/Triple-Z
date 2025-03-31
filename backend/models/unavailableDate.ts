import mongoose, { Document, Schema } from "mongoose";
import { unavailableDateDB } from "../db";

// Interface for the UnavailableDate document
export interface IUnavailableDate extends Document {
  date: Date;
  reason: string;
}

// Define the schema
const unavailableDateSchema = new Schema<IUnavailableDate>(
  {
    // The date that is marked as unavailable. This field is required and unique.
    date: { type: Date, required: true, unique: true },
    // Optional reason for why the date is not available.
    reason: { type: String, required: true, default: "Not available" },
  },
  {
    // Automatically add createdAt and updatedAt timestamps.
    timestamps: true,
  }
);

// Export the model
export const UnavailableDate = unavailableDateDB.model<IUnavailableDate>(
  "UnavailableDate",
  unavailableDateSchema
);
