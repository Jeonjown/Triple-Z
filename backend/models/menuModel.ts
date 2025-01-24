import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  image: {
    type: String,
  },
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
