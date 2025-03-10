// src/routes/blogRoutes.ts
import { Router } from "express";
import {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
} from "../controllers/blogController";
import upload from "../middleware/uploadImage"; // middleware for handling image uploads
import { verifyAdminToken } from "../middleware/verifyAdminToken"; // middleware for admin token verification

const router: Router = Router();

// POST /api/blogs - Create a new blog post (admin only, with image upload)
router.post("/", verifyAdminToken, upload.single("image"), createBlogPost);

// GET /api/blogs - Retrieve all blog posts (public)
router.get("/", getAllBlogPosts);

// GET /api/blogs/:id - Retrieve a single blog post by ID (public)
router.get("/:id", getBlogPostById);

// PUT /api/blogs/:id - Update a blog post by ID (admin only, with image upload)
router.put("/:id", verifyAdminToken, upload.single("image"), updateBlogPost);

// DELETE /api/blogs/:id - Delete a blog post by ID (admin only)
router.delete("/:id", verifyAdminToken, deleteBlogPost);

export default router;
