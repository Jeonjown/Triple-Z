import { Router } from "express";
import {
  createReservation,
  deleteReservation,
  getReservations,
  updateReservationStatus,
  updatePaymentStatus,
  getAllReservations,
  cancelReservation,
  adminRescheduleEventReservation,
} from "../controllers/eventReservationController";
import { validateEventReservation } from "../middleware/validateEventReservation";
import { verifyAdminToken } from "../middleware/verifyAdminToken";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.get("/", getReservations);
router.get("/all", getAllReservations);
router.post(
  "/:userId",
  verifyToken,
  validateEventReservation,
  createReservation
);
router.delete("/", verifyAdminToken, deleteReservation);
router.patch(
  "/event-reschedule",
  verifyAdminToken,
  adminRescheduleEventReservation
);
router.patch("/event-status", verifyAdminToken, updateReservationStatus);
router.patch("/payment-status", verifyAdminToken, updatePaymentStatus);
router.patch("/cancel-reservation", verifyToken, cancelReservation);

export default router;
