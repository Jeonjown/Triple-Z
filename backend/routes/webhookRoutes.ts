// src/routes/webhookRoutes.ts (or your preferred location)

import express from "express";
import { handlePaymongoWebhook } from "../controllers/webhookController"; // Adjust path

const router = express.Router();

// IMPORTANT: Apply express.raw() *only* to this route *before* the verification middleware
router.post("/paymongo", handlePaymongoWebhook);

export default router;
