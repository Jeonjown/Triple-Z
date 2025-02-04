import multer, { StorageEngine } from "multer";

// Set storage options for multer to use memory storage (files are kept in memory)
const storage: StorageEngine = multer.memoryStorage();

// Filter to allow only specific file types (JPG, SVG, and WEBP)
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  // Check if file type is allowed
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file (null means no error)
  } else {
    // Create a new error with the message for invalid file types
    const error = new Error(
      "Invalid file type. Only JPG, SVG, and WEBP are allowed."
    );
    cb(null, false); // Reject the file and pass the error
  }
};

// Configure multer with memory storage, file filter, and size limit
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

export default upload;
