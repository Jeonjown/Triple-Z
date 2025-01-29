import { NextFunction, Request, Response } from "express";
import Menu from "../models/menuModel";
import { createError } from "../utils/createError";
import mongoose from "mongoose";

// Controller to get all subcategories under a specific category
export const getSubcategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categoryId = req.params.categoryId;

    // Find the menu with the specific category ID
    const menu = await Menu.findOne({ "categories._id": categoryId });

    if (!menu) {
      return next(createError("Category not found", 404)); // Custom error handler
    }

    // Find the category object that matches the categoryId
    const category = menu.categories.find(
      (cat) => cat._id.toString() === categoryId
    );

    if (!category) {
      return next(createError("Category not found in menu", 404));
    }

    // Map over the subcategories and return only the name and _id
    const subcategories = category.subcategories.map((subcategory) => ({
      subcategory: subcategory.subcategory, // Name of the subcategory
      _id: subcategory._id, // ID of the subcategory
    }));

    res.status(200).json(subcategories); // Return the mapped subcategories
  } catch (error) {
    next(createError("Error fetching subcategories", 500));
  }
};

// Controller to add a new subcategory to a category
export const addSubcategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categoryId = req.params.categoryId;
    const { subcategoryName } = req.body;

    // Validate input
    if (!subcategoryName || typeof subcategoryName !== "string") {
      return next(createError("Invalid subcategory name", 400));
    }

    // Find the menu document
    const menu = await Menu.findOne({ "categories._id": categoryId });

    if (!menu) {
      return next(createError("Category not found", 404));
    }

    // Find the specific category
    const category = menu.categories.find(
      (cat) => cat._id.toString() === categoryId
    );

    if (!category) {
      return next(createError("Category not found in menu", 404));
    }

    // Add the new subcategory while ensuring the field order
    const newSubcategory = {
      subcategory: subcategoryName,
      items: [], // Initialize items as an empty array
    };

    category.subcategories.push(newSubcategory);

    // Save the updated menu
    await menu.save();

    res.status(200).json({
      message: "Subcategory added successfully",
      menu,
    });
  } catch (error) {
    console.error("Error adding subcategory:", error);
    next(
      createError(
        error instanceof Error
          ? `Error adding subcategory: ${error.message}`
          : "Unknown error occurred",
        500
      )
    );
  }
};

// Controller to delete a subcategory from a category
export const deleteSubcategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categoryId = req.params.categoryId;
    const subcategoryId = req.params.subcategoryId;

    const menu = await Menu.findOne({ "categories._id": categoryId });

    if (!menu) {
      return next(createError("Category not found", 404));
    }

    const category = menu.categories.find(
      (cat) => cat._id.toString() === categoryId
    );

    if (!category) {
      return next(createError("Subcategory not found", 404));
    }

    const subcategoryIndex = category.subcategories.findIndex(
      (sub) => sub._id.toString() === subcategoryId
    );

    if (subcategoryIndex === -1) {
      return next(createError("Subcategory not found", 404));
    }

    category.subcategories.splice(subcategoryIndex, 1); // Remove the subcategory

    await menu.save(); // Save the menu after deletion

    res.status(200).json({ message: "Subcategory deleted successfully", menu });
  } catch (error) {
    next(createError("Error deleting subcategory", 500));
  }
};

// Controller to edit an existing subcategory under a specific category
export const editSubcategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categoryId = req.params.categoryId;
    const subcategoryId = req.params.subcategoryId;
    const { subcategoryName } = req.body; // Expecting a new name for the subcategory

    if (!subcategoryName) {
      return next(createError("Subcategory name is required", 400)); // Custom error handler
    }

    // Convert the categoryId and subcategoryId to ObjectId
    const categoryObjectId = new mongoose.Types.ObjectId(categoryId);
    const subcategoryObjectId = new mongoose.Types.ObjectId(subcategoryId);

    // Find the menu by category ID
    const menu = await Menu.findOne({ "categories._id": categoryObjectId });

    if (!menu) {
      return next(createError("Category not found", 404));
    }

    // Find the specific category
    const category = menu.categories.find(
      (cat) => cat._id.toString() === categoryObjectId.toString()
    );

    if (!category) {
      return next(createError("Category not found", 404));
    }

    // Find the specific subcategory within the category
    const subcategory = category.subcategories.find(
      (sub) => sub._id.toString() === subcategoryObjectId.toString()
    );

    if (!subcategory) {
      return next(createError("Subcategory not found", 404));
    }

    // Update the subcategory name
    subcategory.subcategory = subcategoryName;

    // Save the updated menu
    await menu.save();

    // Respond with a success message
    res.status(200).json({ message: "Subcategory updated successfully", menu });
  } catch (error) {
    next(createError("Error updating subcategory", 500));
  }
};
