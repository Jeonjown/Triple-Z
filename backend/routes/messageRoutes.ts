import express from "express";
import {
  getMessages,
  getRoomsWithLatestMessage,
} from "../controllers/messageController";

const router = express.Router();

router.get("/:roomId", getMessages);
router.get("/", getRoomsWithLatestMessage);
export default router;
