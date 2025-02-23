import { Router } from "express";
import {
  sendNotification,
  sendNotificationToAll,
  subscribe,
} from "../controllers/subscriptionController";

const router = Router();

router.post("/subscribe", subscribe);
router.post("/send/all", sendNotificationToAll);
router.post("/send/user", sendNotification);

export default router;
