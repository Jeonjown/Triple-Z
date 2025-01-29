import mongoose from "mongoose";
import { menuDB } from "../db";

// Define the schema for a menu item (e.g., "Americano" or "Latte")
const menuItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    size: { type: String, required: true },
    description: { type: String, required: true },
    availability: { type: Boolean, required: true },
  },
  { timestamps: true }
);

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
