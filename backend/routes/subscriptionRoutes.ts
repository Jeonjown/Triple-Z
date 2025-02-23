import { Router } from "express";
import {
  sendNotification,
  sendNotificationToAll,
  subscribe,
  unsubscribe,
} from "../controllers/subscriptionController";

const router = Router();

router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);
router.post("/send/all", sendNotificationToAll);
router.post("/send/user", sendNotification);

export default router;
