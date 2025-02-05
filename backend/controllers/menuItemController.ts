import { NextFunction, Request, Response } from "express";
import { createError } from "../utils/createError";
import {
  deleteFromGoogleCloud,
  uploadToGoogleCloud,
} from "../config/googleCloud";
import { Menu } from "../models/menuModel";
import MenuItem from "../models/menuItemModel";
import Category from "../models/categoryModel";
import Subcategory from "../models/subcategoryModel";
import { Types } from "mongoose";

export const getAllMenuItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // ✅ Fetch the menu with populated categories, subcategories, and items
    const menu = await Menu.findOne().populate({
      path: "categories",
      populate: {
        path: "subcategories",
        populate: { path: "items" },
      },
    });

    // ✅ Handle menu not found
    if (!menu) {
      return next(createError("Menu not found", 404));
    }

    // ✅ Flatten and map menu items with additional details
    const menuItems = menu.categories.flatMap((category: any) =>
      category.subcategories.flatMap((subcategory: any) =>
        subcategory.items.map((item: any) => ({
          _id: item._id,
          title: item.title,
          image: item.image,
          basePrice: item.basePrice ?? null,
          sizes: item.sizes || [],
          requiresSizeSelection: item.requiresSizeSelection,
          description: item.description,
          availability: item.availability,
          category: category.category,
          subcategory: subcategory.subcategory,
          createdAt: item.createdAt,
        }))
      )
    );

    // ✅ Handle no items found
    if (menuItems.length === 0) {
      res.status(200).json([]);
      return;
    }

    // ✅ Send the response
    res.status(200).json(menuItems);
  } catch (error) {
    next(
      createError(
        error instanceof Error
          ? `Error fetching menu items: ${error.message}`
          : "Unknown error occurred",
        500
      )
    );
  }
};

export const addMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, subcategory, item } = req.body;
    const imageFile = req.file;

    // ✅ Validate image
    if (!imageFile) {
      return next(createError("Image is required", 400));
    }

    // ✅ Extract fields from item
    const { title, basePrice, sizes, requiresSizeSelection, description } =
      item;

    // Check if required fields are missing
    if (
      !title ||
      basePrice === undefined ||
      requiresSizeSelection === undefined ||
      !description
    ) {
      return next(
        createError(
          "Item must include title, basePrice, requiresSizeSelection, and description",
          400
        )
      );
    }

    // ✅ Parse basePrice into a number
    const parsedBasePrice = Number(basePrice);

    // Handle basePrice and sizes validation based on requiresSizeSelection
    let finalBasePrice: number | null = null; // Declare finalBasePrice as number | null
    let finalSizes = sizes;

    if (requiresSizeSelection === "true" || requiresSizeSelection === true) {
      // If requiresSizeSelection is true:
      if (!sizes || sizes.length === 0) {
        return next(
          createError(
            "Sizes are required when requiresSizeSelection is true",
            400
          )
        );
      }
      finalBasePrice = null; // Set basePrice to null when size selection is required
    } else if (
      requiresSizeSelection === "false" ||
      requiresSizeSelection === false
    ) {
      // If requiresSizeSelection is false:
      finalSizes = []; // Clear sizes if size selection is not required

      // Validate basePrice for false requiresSizeSelection
      if (!parsedBasePrice || isNaN(parsedBasePrice)) {
        return next(
          createError(
            "Base price must be a valid number when requiresSizeSelection is false",
            400
          )
        );
      }
      finalBasePrice = parsedBasePrice; // Set basePrice to the parsed value
    } else {
      return next(createError("Invalid value for requiresSizeSelection", 400));
    }

    // ✅ Upload image to Google Cloud
    const imageUrl = await uploadToGoogleCloud(imageFile);

    // ✅ Create MenuItem document with the appropriate basePrice and sizes
    const newItem = new MenuItem({
      title,
      basePrice: finalBasePrice, // Set the basePrice as per the logic
      sizes: finalSizes, // Set sizes based on requiresSizeSelection
      requiresSizeSelection,
      description,
      image: imageUrl,
    });
    await newItem.save();

    // ✅ Validate category and subcategory
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return next(createError("Category not found", 404));
    }

    const existingSubcategory = await Subcategory.findById(subcategory);
    if (!existingSubcategory) {
      return next(createError("Subcategory not found", 404));
    }

    // ✅ Add the item to the subcategory
    existingSubcategory.items.push(newItem._id as Types.ObjectId);
    await existingSubcategory.save();

    res.status(200).json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    next(
      createError(`Error adding menu item: ${(error as Error).message}`, 500)
    );
  }
};

export const updateMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const itemId = req.params.id;
    const {
      title,
      basePrice,
      sizes,
      requiresSizeSelection,
      description,
      availability,
      image,
    } = req.body;

    console.log("FILE: ", req.file); // Log the uploaded file (if any)
    console.log("BODY: ", req.body); // Log the body, including any image URL or other fields

    // Image handling: either upload new file or keep the existing one if no new file is uploaded
    let imageUrl: string | undefined = undefined;

    if (req.file) {
      // If a new file is uploaded, upload it and get the URL
      imageUrl = await uploadToGoogleCloud(req.file);
    } else if (image) {
      // If no new file is uploaded, use the provided image URL
      imageUrl = image;
    }

    // Initialize the object to hold the fields to update
    // Initialize the object to hold the fields to update
    const updateData: { [key: string]: any } = {};

    // Handle size selection logic
    if (requiresSizeSelection === "false" || requiresSizeSelection === false) {
      if (sizes === "null") {
        updateData.sizes = [];
      } else if (sizes && Array.isArray(sizes) && sizes.length > 0) {
        updateData.sizes = sizes;
      }
    } else if (sizes && Array.isArray(sizes) && sizes.length > 0) {
      updateData.sizes = sizes;
    }

    // Clear basePrice if requiresSizeSelection is true
    if (requiresSizeSelection === "true" || requiresSizeSelection === true) {
      updateData.basePrice = null; // Clear basePrice if size selection is required
    } else if (basePrice !== undefined) {
      updateData.basePrice = basePrice; // Otherwise, update with the provided basePrice
    }

    // Only add to the updateData object if the field is provided in the request body
    if (title) updateData.title = title;
    if (imageUrl) updateData.image = imageUrl;
    if (sizes && Array.isArray(sizes) && sizes.length > 0)
      updateData.sizes = sizes;
    if (requiresSizeSelection !== undefined)
      updateData.requiresSizeSelection = requiresSizeSelection;
    if (description) updateData.description = description;
    if (availability !== undefined) updateData.availability = availability;

    // Validate that at least one field is being updated
    if (Object.keys(updateData).length === 0) {
      return next(createError("No fields provided to update", 400));
    }

    // Update the menu item with the provided fields
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      itemId,
      updateData, // Pass the dynamically created update object
      { new: true, runValidators: true }
    );

    if (!updatedMenuItem) {
      return next(createError("Menu item not found", 404));
    }

    res.status(200).json({
      message: "Menu item updated successfully",
      item: updatedMenuItem,
    });
  } catch (error) {
    next(
      createError(
        error instanceof Error
          ? `Error updating item: ${error.message}`
          : "Unknown error occurred",
        500
      )
    );
  }
};

export const deleteMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const itemId = req.params.id;
    const menuItem = await MenuItem.findByIdAndDelete(itemId);

    if (!menuItem) return next(createError("Menu item not found", 404));

    // ✅ Delete the image from Google Cloud
    if (menuItem.image) {
      await deleteFromGoogleCloud(menuItem.image);
    }

    // ✅ Remove references from subcategories
    await Subcategory.updateMany(
      { items: itemId },
      { $pull: { items: itemId } }
    );

    res
      .status(200)
      .json({ message: "Menu item and image deleted successfully" });
  } catch (error) {
    next(
      createError(error instanceof Error ? error.message : "Unknown error", 500)
    );
  }
};
