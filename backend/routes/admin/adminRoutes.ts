import { Router, Request, Response } from "express";
import { getAllUsers } from "../../controllers/admin/userController";

const router = Router();
router.get("/users", getAllUsers);

export default router;
