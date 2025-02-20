import { Router } from "express";
import {
  createReservation,
  deleteReservation,
  getReservations,
  updateReservationStatus,
} from "../controllers/eventReservationController";
import { validateEventReservation } from "../middleware/validateEventReservation";

const router = Router();

router.get("/", getReservations);
router.post("/:userId", validateEventReservation, createReservation);
router.delete("/:reservationId", deleteReservation);
router.patch("/status", updateReservationStatus);

export default router;
