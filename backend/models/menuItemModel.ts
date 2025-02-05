import { Document, Schema } from "mongoose";
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
}

const menuItemSchema = new Schema<IMenuItem>(
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

const MenuItem = menuDB.model<IMenuItem>("MenuItem", menuItemSchema);
export default MenuItem;
