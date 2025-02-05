import { NextFunction, Request, Response } from "express";
import { createError } from "../utils/createError";
import mongoose from "mongoose";
import { Menu } from "../models/menuModel";
import Category from "../models/categoryModel";
import Subcategory from "../models/subcategoryModel";

// Controller to get all subcategories under a specific category
export const getSubcategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { categoryId } = req.params;

    // Fetch the category with populated subcategories
    const category = await Category.findById(categoryId).populate(
      "subcategories"
    );

    if (!category) {
      return next(createError("Category not found", 404));
    }

    // Map to return only subcategory names and IDs
    const subcategories = category.subcategories.map((sub: any) => ({
      subcategory: sub.subcategory,
      _id: sub._id,
    }));

    res.status(200).json(subcategories);
  } catch (error) {
    next(
      createError(
        `Error fetching subcategories: ${(error as Error).message}`,
        500
      )
    );
  }
};
// Controller to add a new subcategory to a category
export const addSubcategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { categoryId } = req.params;
    const { subcategoryName } = req.body;

    if (!subcategoryName || typeof subcategoryName !== "string") {
      return next(createError("Invalid subcategory name", 400));
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return next(createError("Category not found", 404));
    }

    const newSubcategory = new Subcategory({
      subcategory: subcategoryName,
      items: [],
    });
    await newSubcategory.save();

    // Explicitly cast _id as ObjectId
    category.subcategories.push(
      new mongoose.Types.ObjectId(newSubcategory._id)
    );
    await category.save();

    res.status(201).json({
      message: "Subcategory added successfully",
      subcategory: newSubcategory,
    });
  } catch (error) {
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
    const { categoryId, subcategoryId } = req.params;

    // Find the category
    const category = await Category.findById(categoryId);
    if (!category) {
      return next(createError("Category not found", 404));
    }

    // Remove subcategory reference from category
    category.subcategories = category.subcategories.filter(
      (subId) => subId.toString() !== subcategoryId
    );
    await category.save();

    // Delete the actual subcategory document
    await Subcategory.findByIdAndDelete(subcategoryId);

    res.status(200).json({ message: "Subcategory deleted successfully" });
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
    const { subcategoryId } = req.params;
    const { subcategoryName } = req.body;

    // Validate input
    if (!subcategoryName || typeof subcategoryName !== "string") {
      return next(createError("Subcategory name is required", 400));
    }

    // Update the subcategory
    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      subcategoryId,
      { subcategory: subcategoryName },
      { new: true }
    );

    if (!updatedSubcategory) {
      return next(createError("Subcategory not found", 404));
    }

    res.status(200).json({
      message: "Subcategory updated successfully",
      subcategory: updatedSubcategory,
    });
  } catch (error) {
    next(createError("Error updating subcategory", 500));
  }
};
