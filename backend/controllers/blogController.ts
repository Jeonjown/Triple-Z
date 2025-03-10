import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { createError } from "../utils/createError";
import {
  uploadToGoogleCloud,
  deleteFromGoogleCloud,
} from "../config/googleCloud";
import { BlogPost } from "../models/blogModel";

// Create a new blog post with image upload integration
export const createBlogPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, eventType, content } = req.body;

    // Validate required fields
    if (!title || !eventType || !content) {
      return next(createError("Missing required fields", 400));
    }

    // Use file upload if available; fallback to provided image URL
    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = await uploadToGoogleCloud(req.file);
    }

    if (!imageUrl) {
      return next(createError("Image is required", 400));
    }

    const newBlogPost = new BlogPost({
      title,
      eventType,
      content,
      image: imageUrl,
    });

    const savedPost = await newBlogPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(
      createError(error instanceof Error ? error.message : "Unknown error", 500)
    );
  }
};

// Retrieve all blog posts (sorted newest first)
export const getAllBlogPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const blogPosts = await BlogPost.find().sort({ createdAt: -1 });
    res.status(200).json(blogPosts);
  } catch (error) {
    next(
      createError(error instanceof Error ? error.message : "Unknown error", 500)
    );
  }
};

// Retrieve a single blog post by ID
export const getBlogPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return next(createError("Invalid blog post ID", 400));
    }
    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return next(createError("Blog post not found", 404));
    }
    res.status(200).json(blogPost);
  } catch (error) {
    next(
      createError(error instanceof Error ? error.message : "Unknown error", 500)
    );
  }
};

// Update an existing blog post with image upload integration
export const updateBlogPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return next(createError("Invalid blog post ID", 400));
    }

    // Exclude date (we don't allow updating createdAt)
    const { date, image, ...updateData } = req.body;
    const existingPost = await BlogPost.findById(id);
    if (!existingPost) {
      return next(createError("Blog post not found", 404));
    }

    let imageUrl: string | undefined;
    if (req.file) {
      // Delete the old image and upload the new one
      if (existingPost.image) {
        await deleteFromGoogleCloud(existingPost.image);
      }
      imageUrl = await uploadToGoogleCloud(req.file);
    } else if (image) {
      imageUrl = image;
    }

    if (imageUrl) {
      updateData.image = imageUrl;
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedPost) {
      return next(createError("Blog post not found", 404));
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    next(
      createError(error instanceof Error ? error.message : "Unknown error", 500)
    );
  }
};

// Delete a blog post by ID and remove its image from Google Cloud Storage
export const deleteBlogPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return next(createError("Invalid blog post ID", 400));
    }

    // Find and delete the blog post
    const deletedPost = await BlogPost.findByIdAndDelete(id);
    if (!deletedPost) {
      return next(createError("Blog post not found", 404));
    }

    // If the blog post has an associated image, delete it from Google Cloud
    if (deletedPost.image) {
      await deleteFromGoogleCloud(deletedPost.image);
    }

    res
      .status(200)
      .json({ message: "Blog post and image deleted successfully" });
  } catch (error) {
    next(
      createError(error instanceof Error ? error.message : "Unknown error", 500)
    );
  }
};
