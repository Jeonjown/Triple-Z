import { Router } from "express";
import { getAvailableTables } from "../controllers/groupReservationController";

const router = Router();

router.get("/available-tables", getAvailableTables);

export default router;
