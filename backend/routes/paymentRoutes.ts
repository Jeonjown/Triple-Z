import express from "express";
import { createPayment } from "../controllers/paymentController";

const router = express.Router();

router.post("/full", createPayment);
export default router;
