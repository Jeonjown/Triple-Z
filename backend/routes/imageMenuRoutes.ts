// routes/imageRoutes.js
import { Router } from "express";
import { verifyAdminToken } from "../middleware/verifyAdminToken";
import { uploadImageMenu } from "../controllers/imageMenuController";
import { uploadImage } from "../middleware/uploadImage";

const router = Router();

router.post(
  "/upload",
  verifyAdminToken, // Admin token verification middleware
  uploadImage, // Image upload middleware
  uploadImageMenu // Controller for handling the uploaded image
);

export default router;
