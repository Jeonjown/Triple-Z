import { Request, Response, NextFunction } from "express";
import { createError } from "../utils/createError";
import { Menu } from "../models/menuModel";
import Category from "../models/categoryModel";
import MenuItem from "../models/menuItemModel";
import Subcategory from "../models/subcategoryModel";

// clear menu
export const clearMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const menu = await Menu.findOne();
    if (!menu) return next(createError("Menu not found", 404));

    // ✅ Clear categories from the menu
    menu.categories = [];
    await menu.save();

    // ✅ Delete all categories, subcategories, and menu items
    await Category.deleteMany({});
    await Subcategory.deleteMany({});
    await MenuItem.deleteMany({});

    res.status(200).json({
      message:
        "Menu, categories, subcategories, and items cleared successfully",
    });
  } catch (error) {
    next(createError(`Error clearing menu: ${(error as Error).message}`, 500));
  }
};

// Get the menu
export const getMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const menu = await Menu.findOne().populate({
      path: "categories",
      populate: {
        path: "subcategories",
        populate: { path: "items" },
      },
    });

    if (!menu) {
      return next(createError("Menu not found", 404));
    }

    res.status(200).json(menu);
  } catch (error) {
    next(createError(`Error fetching menu: ${(error as Error).message}`, 500));
  }
};
