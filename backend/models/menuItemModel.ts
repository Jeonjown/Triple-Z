import { Document, Schema, Types } from "mongoose";
import { menuDB } from "../db";

export interface IMenuItem extends Document {
  title: string;
  image: string;
  basePrice: number | null;
  sizes: { size: string; sizePrice: number }[];
  requiresSizeSelection: boolean;
  description: string;
  availability: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: Types.ObjectId;
  subcategory: Types.ObjectId;
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    basePrice: { type: Number, required: false, min: 0, default: null },
    sizes: [
      {
        size: { type: String, required: true },
        sizePrice: { type: Number, required: true, min: 0 },
      },
    ],
    requiresSizeSelection: { type: Boolean, required: true },
    description: { type: String, required: true },
    availability: { type: Boolean, default: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
  },
  { timestamps: true }
);

const MenuItem = menuDB.model<IMenuItem>("MenuItem", menuItemSchema);
export default MenuItem;
