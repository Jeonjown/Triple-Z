import { Storage } from "@google-cloud/storage";
import path from "path";
import { createError } from "../utils/createError";

// Load Google Cloud credentials from the environment
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  throw createError("No Google Credentials", 500);
}
if (!process.env.BUCKET_NAME) {
  throw createError("No Bucket Name", 500);
}
if (!process.env.GOOGLE_PROJECT_ID) {
  throw createError("No Google Project Id", 500);
}

const credentialsPath = path.resolve(
  process.env.GOOGLE_APPLICATION_CREDENTIALS
);

// Initialize Google Cloud Storage client
const storage = new Storage({
  keyFilename: credentialsPath,
  projectId: process.env.GOOGLE_PROJECT_ID,
});

const bucket = storage.bucket(process.env.BUCKET_NAME);

export default bucket;
