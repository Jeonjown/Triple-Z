import { NextFunction, Request, Response } from "express";
import Menu from "../models/menuModel";
import { createError } from "../utils/createError";

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

    const menuItems = menu.categories.flatMap((category) =>
      category.subcategories.flatMap((subcategory) => subcategory.items)
    );

    if (menuItems.length === 0) {
      return next(createError("No menu items found", 404));
    }

    res.status(200).json(menuItems); // Send all menu items
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

    // Validate that category, subcategory, and item are provided
    if (!category || !subcategory || !item) {
      return next(
        createError("Category, subcategory, and item are required", 400)
      );
    }

    // Validate that the item object has the required fields
    const { title, image, price, size, description, availability } = item;
    if (
      !title ||
      !image ||
      price === undefined ||
      !size ||
      !description ||
      availability === undefined
    ) {
      return next(
        createError(
          "Item must include title, image, price, size, description, and availability",
          400
        )
      );
    }

    // Fetch the Menu document
    let menu = await Menu.findOne();

    // If Menu doesn't exist, return error
    if (!menu) {
      return next(createError("Menu not found", 404)); // Custom error message for "not found"
    }

    // Find the category index
    const categoryIndex = menu.categories.findIndex(
      (cat) => cat.category === category
    );

    if (categoryIndex === -1) {
      // If category doesn't exist, add a new category
      menu.categories.push({
        category,
        subcategories: [
          {
            subcategory,
            items: [item],
          },
        ],
      });
    } else {
      // Find the subcategory index within the found category
      const subcategoryIndex = menu.categories[
        categoryIndex
      ].subcategories.findIndex((sub) => sub.subcategory === subcategory);

      if (subcategoryIndex === -1) {
        // If subcategory doesn't exist, add a new subcategory
        menu.categories[categoryIndex].subcategories.push({
          subcategory,
          items: [item],
        });
      } else {
        // If subcategory exists, add the item to the existing subcategory
        menu.categories[categoryIndex].subcategories[
          subcategoryIndex
        ].items.push(item);
      }
    }

    // Save the updated menu
    await menu.save();

    // Respond with the updated menu
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
): Promise<void> => {
  try {
    const itemId = req.params.id;

    // Get the updated data from the request body
    const { title, image, price, size, description, availability } = req.body;

    // Validate that the required fields are provided
    if (
      !title ||
      !image ||
      price === undefined ||
      !size ||
      !description ||
      availability === undefined
    ) {
      return next(
        createError(
          "Item must include title, image, price, size, description, and availability",
          400
        )
      );
    }

    // Find and update the item by its ID
    const updatedMenuItem = await Menu.findOneAndUpdate(
      { "categories.subcategories.items._id": itemId },
      {
        $set: {
          "categories.$.subcategories.$[].items.$[item].title": title,
          "categories.$.subcategories.$[].items.$[item].image": image,
          "categories.$.subcategories.$[].items.$[item].price": price,
          "categories.$.subcategories.$[].items.$[item].size": size,
          "categories.$.subcategories.$[].items.$[item].description":
            description,
          "categories.$.subcategories.$[].items.$[item].availability":
            availability,
        },
      },
      {
        new: true, // Return the updated document
        arrayFilters: [{ "item._id": itemId }],
      }
    );

    // If the item was not found or not updated
    if (!updatedMenuItem) {
      return next(createError("Menu item not found", 404));
    }

    res.status(200).json(updatedMenuItem);
  } catch (error) {
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
): Promise<void> => {
  try {
    const itemId = req.params.id;

    // Find the menu document by searching for the item ID in nested items
    const updatedMenu = await Menu.findOneAndUpdate(
      { "categories.subcategories.items._id": itemId }, // Search for the item in subcategories
      {
        $pull: { "categories.$.subcategories.$[].items": { _id: itemId } }, // Remove the item
      },
      { new: true } // Return the updated document
    );

    // If no menu or item was found
    if (!updatedMenu) {
      return next(createError("Menu item not found", 404));
    }

    // Respond with a success message
    res
      .status(200)
      .json({ message: "Menu item deleted successfully", updatedMenu });
  } catch (error) {
    // Use custom error handler for any unexpected errors
    if (error instanceof Error) {
      next(createError(`Error: ${error.message}`, 500));
    } else {
      next(createError("Unknown error occurred", 500));
    }
  }
};
