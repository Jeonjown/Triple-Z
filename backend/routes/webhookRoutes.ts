// src/routes/webhookRoutes.ts
import express from "express";
import { handlePaymongoWebhook } from "../controllers/webhookController"; // Adjust path

const router = express.Router();

// IMPORTANT: Apply express.raw() *only* to this route for webhook body parsing
router.post(
  "/paymongo",
  express.raw({ type: "application/json" }), // Ensures you receive the raw payload
  handlePaymongoWebhook
);

export default router;
