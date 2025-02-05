import { Storage } from "@google-cloud/storage";
import { createError } from "../utils/createError";
import { loadCredentials } from "../utils/loadCredentials";
import sanitize from "sanitize-filename";

// Initialize Google Cloud Storage with credentials
export const initializeGoogleStorage = async () => {
  // Log specific environment variables relevant to Google Cloud Storage

  // Ensure all required environment variables are present
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw createError("No Google Credentials", 500);
  }
  if (!process.env.BUCKET_NAME) {
    throw createError("No Bucket Name", 500);
  }
  if (!process.env.GOOGLE_PROJECT_ID) {
    throw createError("No Google Project Id", 500);
  }

  try {
    // Await credentials loaded from the Base64 string
    const googleCredentials = await loadCredentials(
      process.env.GOOGLE_APPLICATION_CREDENTIALS!
    );

    // Create a new Google Cloud Storage instance with credentials and projectId
    const storage = new Storage({
      credentials: googleCredentials, // Pass the credentials object
      projectId: process.env.GOOGLE_PROJECT_ID,
    });

    const bucket = storage.bucket(process.env.BUCKET_NAME);
    return bucket; // Return the bucket object to be used elsewhere
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError(
        `Error initializing Google Cloud Storage: ${error.message}`,
        500
      );
    } else {
      throw createError(
        "An unknown error occurred while initializing storage.",
        500
      );
    }
  }
};

// Upload a file to Google Cloud Storage and return the public URL
export const uploadToGoogleCloud = async (
  file: Express.Multer.File
): Promise<string> => {
  if (!file) {
    throw new Error("No file provided");
  }

  try {
    const bucket = await initializeGoogleStorage(); // Initialize storage and get bucket
    const fileName = `${Date.now()}-${file.originalname}`; // Unique filename

    const cleanedFileName = `${Date.now()}-${file.originalname
      .replace(/\s+/g, "-")
      .toLowerCase()}`;

    const sanitizedFile = sanitize(cleanedFileName);

    const fileUpload = bucket.file(sanitizedFile);
    // Upload the file using createWriteStream
    const stream = fileUpload.createWriteStream({
      resumable: false,
      contentType: file.mimetype, // Set the MIME type of the file
    });

    return new Promise((resolve, reject) => {
      // On finish, make the file public and return the URL
      stream.on("finish", async () => {
        try {
          // Make the uploaded file publicly accessible

          // Return the public URL
          const publicUrl = `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${cleanedFileName}`;
          resolve(publicUrl);
        } catch (error) {
          reject(error);
        }
      });

      // Handle any upload errors
      stream.on("error", (err) => reject(err));

      // Start streaming the file buffer to Google Cloud
      stream.end(file.buffer);
    });
  } catch (error) {
    // Improved error handling
    if (error instanceof Error) {
      throw createError(
        `Error uploading to Google Cloud: ${error.message}`,
        500
      );
    } else {
      throw createError("An unknown error occurred while uploading file", 500);
    }
  }
};

export const deleteFromGoogleCloud = async (
  publicUrl: string
): Promise<void> => {
  try {
    const bucket = await initializeGoogleStorage();

    // ✅ Extract the file name from the URL
    const fileName = publicUrl.split("/").pop();
    if (!fileName) throw new Error("Invalid URL provided");

    const file = bucket.file(fileName);

    await file.delete();
    console.log(`Successfully deleted: ${fileName}`);
  } catch (error: any) {
    if (error.code === 404) {
      console.warn(`File not found: ${publicUrl}, skipping deletion.`);
    } else {
      throw createError(`Error deleting file: ${error.message}`, 500);
    }
  }
};
