import { Request, Response, NextFunction } from "express";
import { createError } from "../utils/createError";
import Subcategory from "../models/subcategoryModel";
import { Types } from "mongoose";
import Category from "../models/categoryModel";
import { Menu } from "../models/menuModel";

export const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category, subcategories } = req.body;

    // Validate inputs
    if (!category) return next(createError("Category is required", 400));
    if (!Array.isArray(subcategories)) {
      return next(createError("Subcategories must be an array", 400));
    }

    // Create subcategories
    const subcategoryDocs = await Promise.all(
      subcategories.map(async (sub: string) => {
        const newSubcategory = new Subcategory({ subcategory: sub, items: [] });
        return await newSubcategory.save();
      })
    );

    // Create the category with subcategory references
    const newCategory = new Category({
      category,
      subcategories: subcategoryDocs.map((sub) => sub._id),
    });
    await newCategory.save();

    // Find or create the menu
    let menu = await Menu.findOne();
    if (!menu) {
      menu = new Menu({ categories: [] }); // Create menu if not exists
    }

    // Add the new category to the menu
    menu.categories.push(newCategory._id as Types.ObjectId);
    await menu.save();

    res.status(201).json({
      message: "Category added successfully",
      category: newCategory,
    });
  } catch (error) {
    next(
      createError(`Error creating category: ${(error as Error).message}`, 500)
    );
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Populate 'categories' and select only 'category' name and '_id'
    const menu = await Menu.findOne({})
      .populate({
        path: "categories",
        select: "category _id", // Fetch only 'category' and '_id'
      })
      .select("categories"); // Return only the 'categories' field from the Menu

    if (!menu || !menu.categories || menu.categories.length === 0) {
      // Return an empty array if no categories are found
      res.status(200).json([]); // Empty array instead of error
      return;
    }

    res.status(200).json(menu.categories);
  } catch (error) {
    next(
      createError(`Error fetching categories: ${(error as Error).message}`, 500)
    );
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

    // Update the category directly in the Category collection
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { category },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return next(createError("Category not found", 404));
    }

    res.status(200).json({
      message: "Category updated successfully",
      updatedCategory: updatedCategory,
    });
  } catch (error) {
    next(
      createError(`Error updating category: ${(error as Error).message}`, 500)
    );
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categoryId = req.params.id;

    // 1️⃣ Find the category first
    const category = await Category.findById(categoryId);
    if (!category) {
      return next(createError("Category not found", 404));
    }

    // 2️⃣ Delete all related subcategories
    await Subcategory.deleteMany({ _id: { $in: category.subcategories } });

    // 3️⃣ Delete the category itself
    await Category.findByIdAndDelete(categoryId);

    // 4️⃣ Remove the category reference from the menu
    await Menu.updateOne({}, { $pull: { categories: categoryId } });

    res.status(200).json({
      message: "Category and its related subcategories deleted successfully",
    });
  } catch (error) {
    next(
      createError(`Error deleting category: ${(error as Error).message}`, 500)
    );
  }
};
