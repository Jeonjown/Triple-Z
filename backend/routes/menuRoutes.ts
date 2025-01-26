import express from "express";
import { createMenu, getAllMenu } from "../controllers/menuController"; // Import controller functions

const router = express.Router();

// Route to create a menu
router.post("/", createMenu);

// Route to fetch the menu
router.get("/", getAllMenu);

export default router;
