import { Router } from "express";
import {
  deleteUser,
  editUserRole,
  getAllUsers,
} from "../controllers/userController";
import { verifyAdminToken } from "../middleware/verifyAdminToken";
const router = Router();

//ADMIN
router.get("/", verifyAdminToken, getAllUsers);
router.delete("/:userId", verifyAdminToken, deleteUser);
router.patch("/:userId", verifyAdminToken, editUserRole);

export default router;
