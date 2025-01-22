import { Router } from "express";
import { deleteUser, editUserRole } from "../controllers/userController";
import { verifyAdminToken } from "../middleware/verifyAdminToken";

const router = Router();

router.delete("/:userId", verifyAdminToken, deleteUser);
router.patch("/:userId", verifyAdminToken, editUserRole);

export default router;
