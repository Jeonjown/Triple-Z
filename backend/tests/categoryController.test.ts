// categoryController.test.ts

import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import {
  addCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import Subcategory from "../models/subcategoryModel";
import Category from "../models/categoryModel";
import { Menu } from "../models/menuModel";
import { createError } from "../utils/createError";

// --- Mock external dependencies ---
jest.mock("../models/subcategoryModel");
jest.mock("../models/categoryModel");
jest.mock("../models/menuModel");
jest.mock("../utils/createError");

describe("Category Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    // Reset mocks for each test
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  // --- Test addCategory ---
  describe("addCategory", () => {
    it("should call next with error if category is missing", async () => {
      req.body = { subcategories: ["sub1", "sub2"] };
      await addCategory(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it("should call next with error if subcategories is not an array", async () => {
      req.body = { category: "Test", subcategories: "not an array" };
      await addCategory(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it("should add a category successfully", async () => {
      req.body = { category: "Test", subcategories: ["sub1", "sub2"] };

      // --- Mock Subcategory creation ---
      const fakeSubcategory = {
        _id: "subId",
        save: jest.fn().mockResolvedValue({ _id: "subId" }),
      };
      (Subcategory as any).mockImplementation(() => fakeSubcategory);

      // --- Mock Category creation ---
      const fakeCategory = {
        _id: "catId",
        save: jest.fn().mockResolvedValue({ _id: "catId" }),
      };
      (Category as any).mockImplementation(() => fakeCategory);

      // --- Mock Menu.findOne to return null so a new Menu is created ---
      (Menu.findOne as jest.Mock).mockResolvedValue(null);
      const fakeMenu = {
        categories: [],
        save: jest.fn().mockResolvedValue(true),
      };
      (Menu as any).mockImplementation(() => fakeMenu);

      await addCategory(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Category added successfully",
        category: fakeCategory,
      });
    });
  });

  // --- Test getAllCategories ---
  describe("getAllCategories", () => {
    it("should return an empty array if no categories found", async () => {
      // Mock the chain: Menu.findOne().populate().select()
      (Menu.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({ categories: [] }),
        }),
      });
      await getAllCategories(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it("should return categories when found", async () => {
      const fakeCategories = [{ _id: "cat1", category: "Test Category" }];
      (Menu.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({ categories: fakeCategories }),
        }),
      });
      await getAllCategories(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeCategories);
    });
  });

  // --- Test updateCategory ---
  describe("updateCategory", () => {
    it("should call next with error if category is missing in the request body", async () => {
      req.params = { id: "validId" };
      req.body = {}; // Missing category field
      await updateCategory(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it("should update the category successfully", async () => {
      req.params = { id: "validId" };
      req.body = { category: "Updated Category" };

      // Mock successful update
      (Category.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        _id: "validId",
        category: "Updated Category",
      });
      await updateCategory(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Category updated successfully",
        updatedCategory: { _id: "validId", category: "Updated Category" },
      });
    });

    it("should call next with error if category not found", async () => {
      req.params = { id: "validId" };
      req.body = { category: "Updated Category" };
      (Category.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      await updateCategory(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });
  });

  // --- Test deleteCategory ---
  describe("deleteCategory", () => {
    it("should call next with error if category is not found", async () => {
      req.params = { id: "validId" };
      (Category.findById as jest.Mock).mockResolvedValue(null);
      await deleteCategory(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it("should delete category and its subcategories successfully", async () => {
      req.params = { id: "validId" };
      // Set up a fake category with subcategories array
      const fakeCategory = { _id: "validId", subcategories: ["sub1", "sub2"] };
      (Category.findById as jest.Mock).mockResolvedValue(fakeCategory);
      (Subcategory.deleteMany as jest.Mock).mockResolvedValue(true);
      (Category.findByIdAndDelete as jest.Mock).mockResolvedValue(true);
      (Menu.updateOne as jest.Mock).mockResolvedValue(true);

      await deleteCategory(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Category and its related subcategories deleted successfully",
      });
    });
  });
});
