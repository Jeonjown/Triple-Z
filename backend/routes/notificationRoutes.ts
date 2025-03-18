// routes/notificationRoutes.ts
import { Router } from "express";
import {
  createAdminNotification,
  createNotification,
  getNotifications,
  readNotification,
} from "../controllers/notificationController";

const router = Router();
router.post("/create", createNotification);
router.post("/", getNotifications);
router.post("/admin/create", createAdminNotification);
router.patch("/:id/mark-read", readNotification);

export default router;
