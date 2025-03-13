import mongoose from "mongoose";
import { reservationDB } from "../db";

// Revised cart item schema: using a custom string key (_id) and including price & size.
const cartItemSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // now a string (custom unique key)
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // store unit price
    totalPrice: { type: Number, required: true }, // computed: quantity * price
    image: { type: String, required: true },
    size: { type: String }, // optional field for size
  },
  { _id: false } // Prevents Mongoose from creating an extra _id for each cart item.
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
    cart: [cartItemSchema], // revised cart array using the updated schema
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
    subtotal: { type: Number, required: true },
    totalPayment: { type: Number, required: true },
  },
  { timestamps: true }
);

export const GroupReservation = reservationDB.model(
  "GroupReservation",
  reservationSchema
);
