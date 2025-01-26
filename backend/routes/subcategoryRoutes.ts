import { Router } from "express";
import {
  getSubcategories,
  addSubcategory,
  deleteSubcategory,
  editSubcategory,
} from "../controllers/subcategoryController";

const router = Router();

// Route to get all subcategories of a category
router.get("/:categoryId/subcategories", getSubcategories);

// Route to add a new subcategory to a category
router.post("/:categoryId/subcategories", addSubcategory);

// Route to delete a subcategory from a category
router.delete("/:categoryId/subcategories/:subcategoryId", deleteSubcategory);

// Route to edit a subcategory under a category
router.put("/:categoryId/subcategories/:subcategoryId", editSubcategory);

export default router;
