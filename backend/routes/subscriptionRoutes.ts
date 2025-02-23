import { Router } from "express";
import {
  sendNotification,
  subscribe,
} from "../controllers/subscriptionController";

const router = Router();

router.post("/subscribe", subscribe);
router.post("/send", sendNotification);

export default router;
