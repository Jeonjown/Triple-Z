import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Menu item name is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be positive"],
  },
  category: {
    type: String,
    enum: ["Appetizer", "Main Course", "Dessert", "Beverage"],
    required: true,
  },
  availability: {
    type: Boolean,
    default: true, // Default to available
  },
  createdAt: {
    type: Date,
    default: Date.now, // Auto-set creation time
  },
});

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
