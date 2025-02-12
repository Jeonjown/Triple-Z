import { NextFunction, Router, Response } from "express";
import {
  updateMenuItem,
  getAllMenuItems,
  deleteMenuItem,
  addMenuItem,
  getItemsBasedOnCategories,
} from "../controllers/menuItemController";
import { verifyAdminToken } from "../middleware/verifyAdminToken";
import upload from "../middleware/uploadImage";

const router = Router();

router.post("/", verifyAdminToken, upload.single("image"), addMenuItem);
router.get("/:categoryId/:subcategoryId", getItemsBasedOnCategories);
router.get("/", getAllMenuItems);
router.put("/:id", verifyAdminToken, upload.single("image"), updateMenuItem);
router.delete("/:id", verifyAdminToken, deleteMenuItem);

export default router;
