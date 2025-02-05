import { Schema, Document, Types } from "mongoose";
import { menuDB } from "../db";

interface IMenu extends Document {
  categories: Types.ObjectId[];
}

const menuSchema = new Schema<IMenu>({
  categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
});

export const Menu = menuDB.model<IMenu>("Menu", menuSchema);
