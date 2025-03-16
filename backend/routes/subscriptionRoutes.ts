// src/routes/subscriptionRoutes.ts
import { Router } from "express";
import {
  subscribeToAdminsTopic,
  unsubscribeFromAdminsTopic,
} from "../controllers/subscriptionController";

const router = Router();

// Only admin users can access this endpoint
router.post("/subscribe-admin", subscribeToAdminsTopic);
router.post("/unsubscribe-admin", unsubscribeFromAdminsTopic);

export default router;
