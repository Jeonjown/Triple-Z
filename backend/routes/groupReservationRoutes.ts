// groupReservationRoutes.ts
import { Router } from "express";
import {
  createGroupReservation,
  deleteGroupReservation,
  getGroupReservations,
  updateGroupReservationStatus,
  updateGroupPaymentStatus,
  adminRescheduleGroupReservation,
} from "../controllers/groupReservationController";
import { verifyAdminToken } from "../middleware/verifyAdminToken";
import { verifyToken } from "../middleware/verifyToken";
import { validateGroupReservation } from "../middleware/validateGroupReservation";

const router = Router();

// Get all group reservations
router.get("/", getGroupReservations);

// Create a new group reservation (userId in URL)
router.post(
  "/:userId",
  verifyToken,
  validateGroupReservation,
  createGroupReservation
);

// Delete a group reservation (admin only)
router.delete("/", verifyAdminToken, deleteGroupReservation);
// Update group reservation status (admin only)
router.patch("/event-status", verifyAdminToken, updateGroupReservationStatus);
// Update group reservation payment status (admin only)
router.patch("/payment-status", verifyAdminToken, updateGroupPaymentStatus);
router.patch(
  "/group-reschedule",
  verifyAdminToken,
  adminRescheduleGroupReservation
);
export default router;
