import express from "express";
import { clearMenu, getMenu } from "../controllers/menuController";
const router = express.Router();

// Route to fetch the menu
router.get("/", getMenu);

// Reset whole Menu
router.patch("/clear", clearMenu);

export default router;
