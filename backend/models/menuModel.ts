import mongoose, { Document, Schema } from "mongoose";
import { menuDB } from "../db";

// Define the IMenuItem interface
interface IMenuItem extends Document {
  title: string;
  image: string;
  basePrice: number | null;
  sizes: { size: string; sizePrice: number }[];
  requiresSizeSelection: boolean;
  description: string;
  availability: boolean;
  createdAt: Date; // Added createdAt field
  updatedAt: Date; // Added updatedAt field
}

// Define the schema for a menu item (e.g., "Americano" or "Latte")
const menuItemSchema = new mongoose.Schema<IMenuItem>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    basePrice: { type: Number, min: 0 },
    sizes: [
      {
        size: { type: String, required: true },
        sizePrice: { type: Number, required: true, min: 0 },
      },
    ],
    requiresSizeSelection: { type: Boolean, required: true },
    description: { type: String, required: true },
    availability: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Pre-save hook to handle conditional logic
menuItemSchema.pre<IMenuItem>("save", function (next) {
  // If requiresSizeSelection is true, set basePrice to null and ensure sizes are provided
  if (this.requiresSizeSelection) {
    this.basePrice = null; // Set basePrice to null when size selection is enabled
    // Ensure sizes are provided when size selection is enabled
    if (!this.sizes || this.sizes.length === 0) {
      return next(
        new Error("Sizes are required when size selection is enabled.")
      );
    }
  } else {
    // If requiresSizeSelection is false, ensure sizes are empty and basePrice is provided
    this.sizes = []; // Clear sizes when size selection is disabled
    if (!this.basePrice) {
      return next(
        new Error("Base price is required when size selection is disabled.")
      );
    }
  }

  next();
});

// Define the schema for a subcategory within a category (e.g., "Hot Coffees" under "Drinks")
const menuSubcategorySchema = new mongoose.Schema({
  subcategory: { type: String, required: true },
  items: [menuItemSchema],
});

// Define the schema for a category (e.g., "Drinks" or "Food")
const menuCategorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  subcategories: [menuSubcategorySchema],
});

// Define the main menu schema which holds all categories
export const menuSchema = new mongoose.Schema({
  categories: [menuCategorySchema],
});

// Create the Menu model based on the schema
const Menu = menuDB.model("Menu", menuSchema);

export default Menu;
