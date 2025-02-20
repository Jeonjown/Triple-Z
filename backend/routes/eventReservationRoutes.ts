import { Router } from "express";
import {
  createReservation,
  deleteReservation,
  getReservations,
  updateReservationStatus,
  updatePaymentStatus,
} from "../controllers/eventReservationController";
import { validateEventReservation } from "../middleware/validateEventReservation";
import { verifyAdminToken } from "../middleware/verifyAdminToken";

const router = Router();

router.get("/", getReservations);
router.post(
  "/:userId",
  verifyAdminToken,
  validateEventReservation,
  createReservation
);
router.delete("/", verifyAdminToken, deleteReservation);
router.patch("/event-status", verifyAdminToken, updateReservationStatus);
router.patch("/payment-status", verifyAdminToken, updatePaymentStatus);

export default router;
