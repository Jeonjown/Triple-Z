// routes/notificationRoutes.ts
import { Router } from "express";
import {
  createNotification,
  getNotifications,
  readNotification,
} from "../controllers/notificationController";

const router = Router();
router.post("/create", createNotification);
router.post("/", getNotifications);
router.patch("/:id/mark-read", readNotification);
export default router;
