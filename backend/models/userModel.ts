import mongoose from "mongoose";
import { userDB } from "../db";

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: false,
    },
    fullName: { type: String },
    phoneNumber: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

// Register the User model with the userDB connection
const User = userDB.model("User", userSchema);

export default User;
