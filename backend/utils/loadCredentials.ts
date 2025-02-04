import { createError } from "./createError";

// Utility function to decode Base64 string
export const readBase64 = async (
  fileToRead: string
): Promise<string | undefined> => {
  if (!fileToRead) {
    console.error("The provided Base64 string is empty or invalid.");
    return undefined; // return undefined explicitly
  }

  try {
    // Decode the Base64 string to UTF-8
    const decodedData = Buffer.from(fileToRead, "base64").toString("utf8");
    return decodedData;
  } catch (err) {
    console.error("Error decoding the Base64 string:", err);
    return undefined; // Explicitly return undefined if error occurs
  }
};

// Function to load and decode the Base64 encoded credentials
export const loadCredentials = async (fileToRead: string): Promise<object> => {
  const decodedData = await readBase64(fileToRead);

  if (!decodedData) {
    throw createError("Failed to decode Base64 credentials", 500);
  }

  try {
    // Parse the decoded data as JSON (Google credentials are JSON)
    const credentials = JSON.parse(decodedData);
    return credentials;
  } catch (error) {
    throw createError("Error parsing credentials JSON", 500);
  }
};
