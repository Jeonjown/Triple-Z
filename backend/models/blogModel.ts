import mongoose from "mongoose";
import { blogDB } from "../db";

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    eventType: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true } // This adds createdAt and updatedAt fields automatically.
);

export const BlogPost = blogDB.model("BlogPost", blogPostSchema);
