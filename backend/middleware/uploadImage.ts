// middleware/uploadImage.js (or uploadImage.ts)
import multer, { FileFilterCallback } from "multer";

// Memory storage to store files temporarily in memory
const storage = multer.memoryStorage();

// Multer configuration
export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
  fileFilter: (req, file, cb: FileFilterCallback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      const error = new Error(
        "Invalid file type. Only JPEG, PNG, and WEBP are allowed."
      );
      cb(error as any, false); // Reject the file
    }
  },
}).single("image");
