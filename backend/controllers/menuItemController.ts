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
import { toTitleCase } from "../utils/toTitleCase";

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
          categoryId: category._id,
          categoryName: category.category,
          subcategoryId: subcategory._id,
          subcategoryName: subcategory.subcategory,
          createdAt: item.createdAt,
        }))
      )
    );

    // ✅ Handle no items found
    if (menuItems.length === 0) {
      res.status(200).json([]);
      return;
    }

    res.status(200).json(menuItems);
  } catch (error) {
    next(
      createError(`Error fetching menu items: ${(error as Error).message}`, 500)
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

    // ✅ Validate category and subcategory existence
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return next(createError("Category not found", 404));
    }

    const existingSubcategory = await Subcategory.findById(subcategory);
    if (!existingSubcategory) {
      return next(createError("Subcategory not found", 404));
    }

    // ✅ Parse basePrice into a number
    const parsedBasePrice = Number(basePrice);

    let finalBasePrice: number | null = null;
    let finalSizes = sizes;

    if (requiresSizeSelection === "true" || requiresSizeSelection === true) {
      if (!sizes || sizes.length === 0) {
        return next(
          createError(
            "Sizes are required when requiresSizeSelection is true",
            400
          )
        );
      }

      // Convert  to title case

      finalSizes = sizes.map(
        (sizeObj: { size: string; sizePrice: number }) => ({
          ...sizeObj,
          size: toTitleCase(sizeObj.size), // Apply title case to size
        })
      );

      finalBasePrice = null; // No base price when size selection is required
    } else if (
      requiresSizeSelection === "false" ||
      requiresSizeSelection === false
    ) {
      finalSizes = []; // No sizes if size selection isn't required

      if (!parsedBasePrice || isNaN(parsedBasePrice)) {
        return next(
          createError(
            "Base price must be a valid number when requiresSizeSelection is false",
            400
          )
        );
      }
      finalBasePrice = parsedBasePrice;
    } else {
      return next(createError("Invalid value for requiresSizeSelection", 400));
    }

    // ✅ Upload image to Google Cloud
    const imageUrl = await uploadToGoogleCloud(imageFile);

    // ✅ Create MenuItem document
    const finalTitle = toTitleCase(title);
    const newItem = new MenuItem({
      title: finalTitle,
      basePrice: finalBasePrice,
      sizes: finalSizes,
      requiresSizeSelection,
      description,
      image: imageUrl,
      category: existingCategory._id,
      subcategory: existingSubcategory._id,
    });

    // ✅ Save the new item to the database
    await newItem.save();

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
      category,
      subcategory,
    } = req.body;

    console.log("Received from frontend:");
    console.log("FILE: ", req.file);
    console.log("BODY: ", req.body);

    // Fetch the existing menu item
    const oldItem = await MenuItem.findById(itemId);
    if (!oldItem) {
      return next(createError("Menu item not found", 404));
    }

    let imageUrl: string | undefined = undefined;

    if (req.file) {
      // ✅ If a new image is uploaded, delete the old one
      if (oldItem.image) {
        await deleteFromGoogleCloud(oldItem.image);
      }
      imageUrl = await uploadToGoogleCloud(req.file);
    } else if (image) {
      imageUrl = image;
    }

    const updateData: { [key: string]: any } = {};

    // Convert title to title case if provided
    if (title) updateData.title = toTitleCase(title);

    // Handle sizes and basePrice
    if (requiresSizeSelection === "false" || requiresSizeSelection === false) {
      updateData.sizes = sizes === "null" ? [] : sizes;
    } else if (sizes && Array.isArray(sizes) && sizes.length > 0) {
      // Convert sizes to title case
      updateData.sizes = sizes.map(
        (sizeObj: { size: string; sizePrice: number }) => ({
          ...sizeObj,
          size: toTitleCase(sizeObj.size), // Apply title case to size
        })
      );
    }

    updateData.basePrice =
      requiresSizeSelection === "true" || requiresSizeSelection === true
        ? null
        : basePrice ?? updateData.basePrice;

    if (imageUrl) updateData.image = imageUrl;
    if (requiresSizeSelection !== undefined)
      updateData.requiresSizeSelection = requiresSizeSelection;
    if (description) updateData.description = description;
    if (availability !== undefined) updateData.availability = availability;
    if (category) updateData.category = category;
    if (subcategory) updateData.subcategory = subcategory;

    if (Object.keys(updateData).length === 0) {
      return next(createError("No fields provided to update", 400));
    }

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      itemId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedMenuItem) {
      return next(createError("Menu item not found", 404));
    }

    // ✅ Update subcategory if changed
    if (subcategory && oldItem.subcategory.toString() !== subcategory) {
      await Subcategory.findByIdAndUpdate(oldItem.subcategory, {
        $pull: { items: itemId },
      });
      await Subcategory.findByIdAndUpdate(subcategory, {
        $addToSet: { items: itemId },
      });
    }

    res.status(200).json({
      message: "Menu item updated successfully",
      item: updatedMenuItem,
    });
  } catch (error) {
    next(
      createError(error instanceof Error ? error.message : "Unknown error", 500)
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
