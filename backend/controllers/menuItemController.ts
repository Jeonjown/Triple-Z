import { NextFunction, Request, Response } from "express";
import Menu from "../models/menuModel";
import { createError } from "../utils/createError";
import { uploadToGoogleCloud } from "../config/googleCloud";

export const getAllMenuItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const menu = await Menu.findOne(); // Fetch the single menu
    if (!menu) {
      return next(createError("Menu not found", 404));
    }

    // Flatten and map menu items, now with basePrice and sizes
    const menuItems = menu.categories.flatMap((category) =>
      category.subcategories.flatMap((subcategory) =>
        subcategory.items.map((item) => ({
          _id: item._id,
          title: item.title,
          image: item.image,
          basePrice: item.basePrice, // Added basePrice
          sizes: item.sizes, // Added sizes
          requiresSizeSelection: item.requiresSizeSelection, // Added requiresSizeSelection
          description: item.description,
          availability: item.availability,
          category: category.category,
          subcategory: subcategory.subcategory,
          createdAt: item.createdAt,
        }))
      )
    );

    if (menuItems.length === 0) {
      return next(createError("No menu items found", 404));
    }

    res.status(200).json(menuItems); // Return flattened menu items with category and subcategory
  } catch (error) {
    next(createError("Error fetching menu items", 500));
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

    // Validate uploaded image
    if (!imageFile) {
      return next(createError("Image is required", 400));
    }

    // Destructure fields from the item
    const { title, basePrice, sizes, requiresSizeSelection, description } =
      item;

    // Validate required fields
    if (
      !title ||
      basePrice === undefined ||
      requiresSizeSelection === undefined ||
      !description ||
      (requiresSizeSelection === "true" && (!sizes || sizes.length === 0))
    ) {
      return next(
        createError(
          "Item must include title, basePrice, sizes, requiresSizeSelection, and description",
          400
        )
      );
    }

    // Upload the image to Google Cloud
    const imageUrl = await uploadToGoogleCloud(imageFile);

    // Create a new item object
    const newItem = { ...item, image: imageUrl };

    // Find the menu
    let menu = await Menu.findOne();
    if (!menu) {
      return next(createError("Menu not found", 404));
    }

    // Find existing category
    const categoryIndex = menu.categories.findIndex(
      (cat) => cat._id.toString() === category
    );

    if (categoryIndex === -1) {
      // Category not found, create it
      menu.categories.push({
        _id: category,
        subcategories: [{ _id: subcategory, items: [newItem] }],
      });
    } else {
      // Category exists, find subcategory
      const subcategoryIndex = menu.categories[
        categoryIndex
      ].subcategories.findIndex((sub) => sub._id.toString() === subcategory);

      if (subcategoryIndex === -1) {
        // Subcategory not found, create it
        menu.categories[categoryIndex].subcategories.push({
          _id: subcategory,
          items: [newItem],
        });
      } else {
        // Both category and subcategory exist, add item
        menu.categories[categoryIndex].subcategories[
          subcategoryIndex
        ].items.push(newItem);
      }
    }

    // Save to DB
    await menu.save();
    res.status(200).json({ message: "Item added successfully", menu });
  } catch (error) {
    if (error instanceof Error) {
      return next(createError(`Error: ${error.message}`, 500));
    } else {
      return next(createError("Unknown error occurred", 500));
    }
  }
};

export const updateMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const itemId = req.params.id;
    const {
      title,
      image,
      basePrice,
      sizes,
      requiresSizeSelection,
      description,
      availability,
    } = req.body;

    // Validate that the required fields are provided
    if (
      !title ||
      !image ||
      basePrice === undefined ||
      !sizes ||
      requiresSizeSelection === undefined ||
      !description ||
      availability === undefined
    ) {
      return next(
        createError(
          "Item must include title, image, basePrice, sizes, requiresSizeSelection, description, and availability",
          400
        )
      );
    }

    const updatedMenuItem = await Menu.findOneAndUpdate(
      { "categories.subcategories.items._id": itemId },
      {
        $set: {
          "categories.$.subcategories.$[].items.$[item].title": title,
          "categories.$.subcategories.$[].items.$[item].image": image,
          "categories.$.subcategories.$[].items.$[item].basePrice": basePrice,
          "categories.$.subcategories.$[].items.$[item].sizes": sizes,
          "categories.$.subcategories.$[].items.$[item].requiresSizeSelection":
            requiresSizeSelection,
          "categories.$.subcategories.$[].items.$[item].description":
            description,
          "categories.$.subcategories.$[].items.$[item].availability":
            availability,
        },
      },
      { new: true, arrayFilters: [{ "item._id": itemId }] }
    );

    if (!updatedMenuItem) {
      return next(createError("Menu item not found", 404));
    }

    res.status(200).json(updatedMenuItem);
  } catch (error: unknown) {
    // Handling unknown error type
    if (error instanceof Error) {
      return next(createError(`Error: ${error.message}`, 500));
    } else {
      return next(createError("Unknown error occurred", 500));
    }
  }
};

export const deleteMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const itemId = req.params.id;

    const updatedMenu = await Menu.findOneAndUpdate(
      { "categories.subcategories.items._id": itemId },
      {
        $pull: { "categories.$.subcategories.$[].items": { _id: itemId } },
      },
      { new: true }
    );

    if (!updatedMenu) {
      return next(createError("Menu item not found", 404));
    }

    res
      .status(200)
      .json({ message: "Menu item deleted successfully", updatedMenu });
  } catch (error: unknown) {
    // Handling unknown error type
    if (error instanceof Error) {
      return next(createError(`Error: ${error.message}`, 500));
    } else {
      return next(createError("Unknown error occurred", 500));
    }
  }
};
