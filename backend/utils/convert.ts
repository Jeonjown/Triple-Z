import fs from "fs";
import path from "path";

// Replace with the path to your JSON file
const jsonFilePath = path.join(__dirname, "file");

try {
  // Read the JSON file synchronously
  const jsonData = fs.readFileSync(jsonFilePath);

  // Convert the data to a Base64 string
  const base64Data = jsonData.toString("base64");

  // Output the Base64 string to the console
  console.log("Base64 Encoded JSON:", base64Data);
} catch (err) {
  console.error("Error reading or converting file:", err);
}
