import { Response, Request, NextFunction } from "express";
import { createError } from "../utils/createError";
import User from "../models/userModel";
import mongoose from "mongoose";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();

    if (!users.length) {
      res.status(200).json({ message: "No users found." });
      return;
    }

    res.status(200).json(users);
  } catch (error) {
    createError("something went wrong.", 500);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;

    // Step 1: Validate the userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(200).json({ mesage: "User is Guest", info: null });
      return;
    }

    // Step 2: Attempt to find the user
    const user = await User.findById(userId);

    // If no user is found, return an empty array
    if (!user) {
      res.status(200).json({ mesage: "User is Guest", info: null });
      return;
    }

    // Return the found user object
    res.status(200).json({ mesage: "User Found!", info: user });
  } catch (error: any) {
    // Step 3: Handle specific CastError from Mongoose
    if (error.name === "CastError") {
      res.status(200).json([]);
      return;
    }
    // For any other error, pass it to the error handler
    return next(createError("something went wrong.", 500));
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const userToDelete = await User.findByIdAndDelete(userId);

    if (!userToDelete) {
      next(createError("User not found", 404));
      return;
    }

    res
      .status(200)
      .json({ message: "User Deleted successfully", userToDelete });
  } catch (error) {
    next(error);
  }
};

export const editUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { roleToUpdate } = req.body;

    // Check if the roleToUpdate is valid
    if (!["admin", "user"].includes(roleToUpdate)) {
      return next(createError("Invalid Role", 400));
    }

    // Update the role in one step
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: roleToUpdate },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return next(createError("User not found", 404));
    }

    res
      .status(200)
      .json({ message: "User role updated successfully", user: updatedUser });
  } catch (error) {
    next(error);
  }
};
