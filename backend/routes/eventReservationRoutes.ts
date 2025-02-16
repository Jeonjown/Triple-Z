import { Router } from "express";
import {
  createReservation,
  deleteReservation,
  getReservations,
  updateReservationStatus,
} from "../controllers/eventReservationController";

const router = Router();

router.get("/", getReservations);
router.post("/:userId", createReservation);
router.delete("/:reservationId", deleteReservation);
router.patch("/:reservationId", updateReservationStatus);

export default router;
