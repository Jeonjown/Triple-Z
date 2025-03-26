import { Router } from "express";
import {
  createReservation,
  deleteReservation,
  getReservations,
  updateReservationStatus,
  updatePaymentStatus,
  adminRescheduleReservation,
} from "../controllers/eventReservationController";
import { validateEventReservation } from "../middleware/validateEventReservation";
import { verifyAdminToken } from "../middleware/verifyAdminToken";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.get("/", getReservations);
router.post(
  "/:userId",
  verifyToken,
  validateEventReservation,
  createReservation
);
router.delete("/", verifyAdminToken, deleteReservation);
router.patch("/reschedule", verifyAdminToken, adminRescheduleReservation);
router.patch("/event-status", verifyAdminToken, updateReservationStatus);
router.patch("/payment-status", verifyAdminToken, updatePaymentStatus);

export default router;
