import express from "express";
import {
  createOrUpdateEventSettings,
  getEventSettings,
  deleteEventSettings,
} from "../controllers/eventSettingsController";
import { validateEventSettings } from "../middleware/validateEventSettings";

const router = express.Router();

router.post("/", validateEventSettings, createOrUpdateEventSettings);
router.get("/", getEventSettings);
router.delete("/", deleteEventSettings);

export default router;
