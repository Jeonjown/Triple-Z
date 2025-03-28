// blogController.test.ts

import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { createError } from "../utils/createError";
import {
  uploadToGoogleCloud,
  deleteFromGoogleCloud,
} from "../config/googleCloud";
import { BlogPost } from "../models/blogModel";
import {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
} from "../controllers/blogController";

// --- Mock external dependencies ---
jest.mock("../utils/createError");
jest.mock("../config/googleCloud");
jest.mock("../models/blogModel");

describe("Blog Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    // Reset request, response and next mocks for each test
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  // --- Test createBlogPost ---
  describe("createBlogPost", () => {
    it("should call next with error if required fields are missing", async () => {
      // Missing title, eventType, and content
      req.body = { title: "", eventType: "", content: "" };
      await createBlogPost(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it("should use file upload when req.file is provided", async () => {
      const fakeImageUrl = "http://fakeurl.com/image.png";
      req.body = { title: "Test", eventType: "Event", content: "Content" };
      req.file = { originalname: "image.png" } as any;
      // Mock uploadToGoogleCloud to resolve with fakeImageUrl
      (uploadToGoogleCloud as jest.Mock).mockResolvedValue(fakeImageUrl);

      // Mock BlogPost.save
      const saveMock = jest.fn().mockResolvedValue({
        _id: "1",
        title: "Test",
        eventType: "Event",
        content: "Content",
        image: fakeImageUrl,
      });
      (BlogPost as any).mockImplementation(() => ({ save: saveMock }));

      await createBlogPost(req as Request, res as Response, next);
      expect(uploadToGoogleCloud).toHaveBeenCalledWith(req.file);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });
  });

  // --- Test getAllBlogPosts ---
  describe("getAllBlogPosts", () => {
    it("should return all blog posts sorted descending by createdAt", async () => {
      const fakePosts = [
        { _id: "1", title: "A", createdAt: new Date() },
        { _id: "2", title: "B", createdAt: new Date(Date.now() - 1000) },
      ];
      // Mock BlogPost.find().sort() chain
      (BlogPost.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue(fakePosts),
      });

      await getAllBlogPosts(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakePosts);
    });
  });

  // --- Test getBlogPostById ---
  describe("getBlogPostById", () => {
    it("should call next with error if the blog post id is invalid", async () => {
      req.params = { id: "invalid" };
      await getBlogPostById(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it("should return blog post if found", async () => {
      const validId = new Types.ObjectId().toString();
      req.params = { id: validId };
      const fakePost = { _id: validId, title: "Test" };
      (BlogPost.findById as jest.Mock).mockResolvedValue(fakePost);

      await getBlogPostById(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakePost);
    });
  });

  // --- Test updateBlogPost ---
  describe("updateBlogPost", () => {
    it("should call next with error if the blog post id is invalid", async () => {
      req.params = { id: "invalid" };
      await updateBlogPost(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it("should update a blog post and return the updated post", async () => {
      const validId = new Types.ObjectId().toString();
      req.params = { id: validId };
      req.body = {
        title: "Updated",
        content: "Updated content",
        image: "oldImageUrl",
      };

      // Mock finding an existing post
      const existingPost = { _id: validId, image: "oldImageUrl" };
      (BlogPost.findById as jest.Mock).mockResolvedValue(existingPost);

      // Test update without file upload (using provided image)
      const updatedPost = {
        _id: validId,
        title: "Updated",
        content: "Updated content",
        image: "oldImageUrl",
      };
      (BlogPost.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedPost);

      await updateBlogPost(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedPost);
    });
  });

  // --- Test deleteBlogPost ---
  describe("deleteBlogPost", () => {
    it("should call next with error if the blog post id is invalid", async () => {
      req.params = { id: "invalid" };
      await deleteBlogPost(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it("should delete a blog post and remove its image from Google Cloud", async () => {
      const validId = new Types.ObjectId().toString();
      req.params = { id: validId };

      // Mock a deleted post with an image
      const deletedPost = { _id: validId, image: "imageUrl" };
      (BlogPost.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedPost);
      (deleteFromGoogleCloud as jest.Mock).mockResolvedValue(true);

      await deleteBlogPost(req as Request, res as Response, next);
      expect(deleteFromGoogleCloud).toHaveBeenCalledWith(deletedPost.image);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Blog post and image deleted successfully",
      });
    });
  });
});
