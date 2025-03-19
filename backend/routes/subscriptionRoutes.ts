// routes/subscriptionRoutes.ts
import { Router } from "express";
import {
  registerFcmToken,
  removeFcmToken,
} from "../controllers/subscriptionController";

const router = Router();

router.post("/register", registerFcmToken);
router.post("/remove", removeFcmToken);

export default router;
