import { Router } from "express";
import {
  sendNotification,
  sendNotificationToAdmin,
  sendNotificationToAll,
  subscribe,
  unsubscribe,
} from "../controllers/subscriptionController";

const router = Router();

router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);
router.post("/send/all", sendNotificationToAll);
router.post("/send/user", sendNotification);
router.post("/send/admin", sendNotificationToAdmin);

export default router;
