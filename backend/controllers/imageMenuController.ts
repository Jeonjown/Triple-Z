import { Request, Response, NextFunction } from "express";
import { createError } from "../utils/createError";
import bucket from "../config/googleCloud";

// Image upload controller
export const uploadImageMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) return next(createError("No file uploaded", 400));

    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: req.file.mimetype,
    });

    blobStream.on("error", (err) => {
      return next(createError(`Upload failed: ${err.message}`, 500));
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      res
        .status(200)
        .json({ message: "File uploaded successfully", publicUrl });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    return next(createError(`Error during image upload: ${error}`, 500));
  }
};
