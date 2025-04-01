// src/routes/analyticsRoutes.ts
import { Router } from "express";
import {
  getMonthlyUsers,
  getReservationStats,
  getReservationTimeSeries,
  getReservationTotals,
  getTotalUsers,
} from "../controllers/analyticsController";

const router: Router = Router();

router.get("/total-reservations", getReservationTotals);
router.get("/reservations-timeseries", getReservationTimeSeries);
router.get("/reservation-stats", getReservationStats);
router.get("/total-users", getTotalUsers);
router.get("/monthly-users", getMonthlyUsers);

export default router;
