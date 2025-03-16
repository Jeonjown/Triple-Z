import * as admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Read the base64-encoded JSON from the environment variable
const firebaseJsonBase64 = process.env.FIREBASE_JSON as string;

// Decode the base64 string into a JSON string
const firebaseJsonString = Buffer.from(firebaseJsonBase64, "base64").toString(
  "utf-8"
);

// Parse the JSON string into an object
const firebaseServiceAccount = JSON.parse(
  firebaseJsonString
) as admin.ServiceAccount;

// Initialize Firebase Admin with the decoded credentials
admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount),
});

// Export admin for use in your backend
export default admin;
