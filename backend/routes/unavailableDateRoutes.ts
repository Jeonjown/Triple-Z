import { Router } from "express";

import { verifyAdminToken } from "../middleware/verifyAdminToken";
import {
  getAllUnavailableDates,
  markDateNotAvailable,
  unmarkDateNotAvailable,
} from "../controllers/unavailableDateController";

const router: Router = Router();

// POST /api/unavailable-dates - Mark a date as not available (admin only)
router.post("/", verifyAdminToken, markDateNotAvailable);

// GET /api/unavailable-dates - Retrieve all unavailable dates (public or admin as needed)
router.get("/", getAllUnavailableDates);

// DELETE /api/unavailable-dates/:id - Unmark a date as not available (admin only)
router.delete("/:id", verifyAdminToken, unmarkDateNotAvailable);

export default router;
