import { Document, Schema, model, Types } from "mongoose";
import { menuDB } from "../db";

export interface ICategory extends Document {
  category: string;
  subcategories: Types.ObjectId[];
}

const categorySchema = new Schema<ICategory>({
  category: { type: String, required: true },
  subcategories: [{ type: Schema.Types.ObjectId, ref: "Subcategory" }],
});

const Category = menuDB.model<ICategory>("Category", categorySchema);
export default Category;
