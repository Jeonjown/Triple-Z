import { Router } from "express";
import {
  getAllCategories,
  updateCategory,
  deleteCategory,
  addCategory,
} from "../controllers/categoryController";
import { verifyAdminToken } from "../middleware/verifyAdminToken";

const router = Router();

//POST
router.post("/", verifyAdminToken, addCategory);

//GET
router.get("/", verifyAdminToken, getAllCategories);

//PUT
router.put("/:id", verifyAdminToken, updateCategory);
// //DELETE
router.delete("/:id", verifyAdminToken, deleteCategory);

export default router;
