import { NextFunction, Router, Response, Request } from "express";
import {
  updateMenuItem,
  getAllMenuItems,
  deleteMenuItem,
  addMenuItem,
} from "../controllers/menuItemController";
import { verifyAdminToken } from "../middleware/verifyAdminToken";

const router = Router();

router.post("/", verifyAdminToken, addMenuItem);
router.get("/", verifyAdminToken, getAllMenuItems);
router.put("/:id", verifyAdminToken, updateMenuItem);
router.delete("/:id", verifyAdminToken, deleteMenuItem);

export default router;
