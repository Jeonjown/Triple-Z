import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Ensure the Mongo URI is available
if (
  !process.env.MONGO_URI_MENU_DB ||
  !process.env.MONGO_URI_USER_DB ||
  !process.env.MONGO_URI_RESERVATION_DB ||
  !process.env.MONGO_URI_NOTIFICATION_DB
) {
  throw new Error("Mongo URI for one or more DBs is missing!");
}

//  separate connections for user, menu, and reservation databases
export const userDB = mongoose.createConnection(process.env.MONGO_URI_USER_DB!);
export const menuDB = mongoose.createConnection(process.env.MONGO_URI_MENU_DB!);
export const reservationDB = mongoose.createConnection(
  process.env.MONGO_URI_RESERVATION_DB!
);
export const subscriptionDB = mongoose.createConnection(
  process.env.MONGO_URI_SUBSCRIPTION_DB!
);
export const notificationDB = mongoose.createConnection(
  process.env.MONGO_URI_NOTIFICATION_DB!
);

// Connection handling for menuDB
menuDB.once("open", () => console.log("Menu DB connected successfully"));
menuDB.on("error", (err) => console.error("Error connecting to Menu DB:", err));

// Connection handling for userDB
userDB.once("open", () => console.log("User DB connected successfully"));
userDB.on("error", (err) => console.error("Error connecting to User DB:", err));

// Connection handling for reservationDB
reservationDB.once("open", () =>
  console.log("Reservation DB connected successfully")
);
reservationDB.on("error", (err) =>
  console.error("Error connecting to Reservation DB:", err)
);

// Connection handling for subscriptionDB
subscriptionDB.once("open", () =>
  console.log("Subscriptions DB connected successfully")
);
subscriptionDB.on("error", (err) =>
  console.error("Error connecting to Subscriptions DB:", err)
);

// Connection handling for notificationDB
notificationDB.once("open", () =>
  console.log("Notification DB connected successfully")
);
notificationDB.on("error", (err) =>
  console.error("Error connecting to Notification DB:", err)
);
