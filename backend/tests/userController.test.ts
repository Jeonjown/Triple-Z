import { Request, Response, NextFunction } from "express";
import {
  getAllUsers,
  getUser,
  deleteUser,
  editUserRole,
} from "../controllers/userController";
import User from "../models/userModel";
import { createError } from "../utils/createError";
import mongoose from "mongoose";

jest.mock("../models/userModel");
jest.mock("../utils/createError");

describe("User Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should return message if no users found", async () => {
      (User.find as jest.Mock).mockResolvedValue([]);
      await getAllUsers(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "No users found." });
    });
    it("should return all users", async () => {
      const fakeUsers = [{ _id: "user1" }];
      (User.find as jest.Mock).mockResolvedValue(fakeUsers);
      await getAllUsers(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeUsers);
    });
  });

  describe("getUser", () => {
    it("should return guest if invalid userId", async () => {
      req.params = { userId: "invalid" };
      await getUser(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
    });
    it("should return guest if user not found", async () => {
      req.params = { userId: new mongoose.Types.ObjectId().toString() };
      (User.findById as jest.Mock).mockResolvedValue(null);
      await getUser(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
    });
    it("should return user if found", async () => {
      req.params = { userId: new mongoose.Types.ObjectId().toString() };
      const fakeUser = { _id: "user1", username: "Test" };
      (User.findById as jest.Mock).mockResolvedValue(fakeUser);
      await getUser(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        mesage: "User Found!",
        info: fakeUser,
      });
    });
  });

  describe("deleteUser", () => {
    it("should return error if user not found", async () => {
      req.params = { userId: "user1" };
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
      await deleteUser(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });
    it("should delete user successfully", async () => {
      req.params = { userId: "user1" };
      const fakeUser = { _id: "user1" };
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(fakeUser);
      await deleteUser(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User Deleted successfully",
        userToDelete: fakeUser,
      });
    });
  });

  describe("editUserRole", () => {
    it("should return error for invalid role", async () => {
      req.params = { userId: "user1" };
      req.body = { roleToUpdate: "invalid" };
      await editUserRole(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });
    it("should update user role successfully", async () => {
      req.params = { userId: "user1" };
      req.body = { roleToUpdate: "admin" };
      const fakeUser = { _id: "user1", role: "admin" };
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(fakeUser);
      await editUserRole(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User role updated successfully",
        user: fakeUser,
      });
    });
  });
});
