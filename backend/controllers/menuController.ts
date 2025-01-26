import { Request, Response, NextFunction } from "express";
import Menu from "../models/menuModel";
import { createError } from "../utils/createError";

// Create a new menu
export const createMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { categories } = req.body;

    // If categories are provided, create the menu with them
    const newMenu = new Menu({
      categories,
    });

    await newMenu.save();

    res.status(201).json(newMenu);
  } catch (error) {
    console.error("Error creating menu:", error);
    next(createError("Error creating menu", 500));
  }
};

// Get the menu
export const getAllMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const menu = await Menu.find();

    if (!menu) {
      return next(createError("Menu not found", 404));
    }

    res.status(200).json(menu);
  } catch (error) {
    console.error("Error fetching menu:", error);
    next(createError("Error fetching menu", 500));
  }
};
