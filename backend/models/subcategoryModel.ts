import { Document, Schema, Types } from "mongoose";
import { menuDB } from "../db";

export interface ISubcategory extends Document {
  _id: Types.ObjectId;
  subcategory: string;
  items: Types.ObjectId[]; // Use ObjectId for referencing MenuItem
}

const subcategorySchema = new Schema<ISubcategory>({
  subcategory: { type: String, required: true },
  items: [{ type: Schema.Types.ObjectId, ref: "MenuItem" }],
});

const Subcategory = menuDB.model<ISubcategory>(
  "Subcategory",
  subcategorySchema
);
export default Subcategory;
