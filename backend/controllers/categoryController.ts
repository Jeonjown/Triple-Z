import { Request, Response, NextFunction } from "express";
import { createError } from "../utils/createError";
import Menu from "../models/menuModel";
import mongoose from "mongoose";

export const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, subcategories } = req.body;

    // Validate input
    if (!category) {
      return next(createError("Category is required", 400));
    }
    if (!subcategories || !Array.isArray(subcategories)) {
      return next(createError("Subcategories must be an array", 400));
    }

    // Format subcategories to include 'subcategory', 'items', and '_id'
    const formattedSubcategories = subcategories.map((sub) => ({
      subcategory: sub, // Subcategory name
      items: [], // Initialize items as an empty array
      _id: new mongoose.Types.ObjectId(), // Generate a unique ObjectId for each subcategory
    }));

    // Log the formatted subcategories
    console.log("Formatted Subcategories:", formattedSubcategories);

    // Create a new category object
    const newCategory = { category, subcategories: formattedSubcategories };

    // Find the existing menu
    const menu = await Menu.findOne();
    if (!menu) {
      return next(createError("Menu not found", 404));
    }

    // Add the new category to the menu's categories array
    menu.categories.push(newCategory);

    // Save the updated menu with the new category
    await menu.save();

    // Respond with the updated menu
    res.status(201).json(menu);
  } catch (error) {
    console.error("Error creating category:", error);

    // Use the error handler for any unexpected errors
    next(createError("Error creating category", 500));
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const menu = await Menu.findOne(); // Get the single menu
    if (!menu) {
      return next(createError("Menu not found", 404));
    }

    res.status(200).json(menu.categories); // Return all categories
  } catch (error) {
    next(createError("Error fetching categories", 400));
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categoryId = req.params.id;
    const { category } = req.body;

    if (!category) {
      return next(createError("Category is required", 400));
    }

    // Find the menu (assuming only one menu in your database)
    const menu = await Menu.findOne();
    if (!menu) {
      return next(createError("Menu not found", 404));
    }

    // Find the category by ID in the categories array
    const categoryIndex = menu.categories.findIndex(
      (cat) => cat._id.toString() === categoryId
    );
    if (categoryIndex === -1) {
      return next(createError("Category not found", 404));
    }

    // Update only the category name, keep subcategories as is
    menu.categories[categoryIndex].category = category;

    // Save the updated menu
    await menu.save();

    // Return the updated category with subcategories
    res.status(200).json(menu.categories[categoryIndex]);
  } catch (error) {
    console.error("Error updating category:", error);
    next(createError("Error updating category", 400));
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categoryId = req.params.id;

    const menu = await Menu.findOne();
    if (!menu) {
      return next(createError("Menu not found", 404));
    }

    // Find the category index to remove it
    const categoryIndex = menu.categories.findIndex(
      (cat) => cat._id.toString() === categoryId
    );
    if (categoryIndex === -1) {
      return next(createError("Category not found", 404));
    }

    // Remove the category
    menu.categories.splice(categoryIndex, 1);
    await menu.save(); // Save the updated menu

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    next(createError("Error deleting category", 400));
  }
};
