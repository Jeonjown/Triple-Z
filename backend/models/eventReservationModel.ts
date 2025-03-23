import mongoose from "mongoose";
import { reservationDB } from "../db";

// Define the cart item schema separately if necessary
const cartItemSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    image: { type: String, required: true },
  },
  { _id: false } // Prevent generating an extra _id for each cart item
);

const reservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    partySize: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    eventType: { type: String, required: true },
    cart: [cartItemSchema], // Added cart array with menu items
    eventStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Not Paid", "Partially Paid", "Paid"],
      default: "Not Paid",
    },
    specialRequest: { type: String },
    eventFee: { type: Number, required: true },
    isCorkage: { type: Boolean, requried: true },
    subtotal: { type: Number, required: true },
    totalPayment: { type: Number, required: true },
  },
  { timestamps: true }
);

// Register the EventReservation model with the reservationDB connection
export const EventReservation = reservationDB.model(
  "EventReservation",
  reservationSchema
);
