// routes/notificationRoutes.ts
import { Router } from "express";
import {
  createNotification,
  getNotifications,
} from "../controllers/notificationController";

const router = Router();
router.post("/", createNotification);
router.post("/get", getNotifications);
export default router;
