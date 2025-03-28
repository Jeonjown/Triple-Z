// menuController.test.ts
import { Request, Response, NextFunction } from "express";
import { clearMenu, getMenu } from "../controllers/menuController";
import { Menu } from "../models/menuModel";
import Category from "../models/categoryModel";
import MenuItem from "../models/menuItemModel";
import Subcategory from "../models/subcategoryModel";
import { createError } from "../utils/createError";

jest.mock("../models/menuModel");
jest.mock("../models/categoryModel");
jest.mock("../models/menuItemModel");
jest.mock("../models/subcategoryModel");
jest.mock("../utils/createError");

describe("Menu Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("clearMenu", () => {
    it("should return error if menu not found", async () => {
      (Menu.findOne as jest.Mock).mockResolvedValue(null);
      await clearMenu(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it("should clear menu and delete all related documents", async () => {
      const fakeMenu = {
        categories: [],
        save: jest.fn().mockResolvedValue(true),
      };
      (Menu.findOne as jest.Mock).mockResolvedValue(fakeMenu);
      (Category.deleteMany as jest.Mock).mockResolvedValue(true);
      (Subcategory.deleteMany as jest.Mock).mockResolvedValue(true);
      (MenuItem.deleteMany as jest.Mock).mockResolvedValue(true);

      await clearMenu(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message:
          "Menu, categories, subcategories, and items cleared successfully",
      });
    });
  });

  describe("getMenu", () => {
    it("should return error if menu is not found", async () => {
      (Menu.findOne as jest.Mock).mockResolvedValue(null);
      await getMenu(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it("should return the menu if found", async () => {
      const fakeMenu = { _id: "menu1", categories: [] };
      (Menu.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(fakeMenu),
      });
      await getMenu(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeMenu);
    });
  });
});
