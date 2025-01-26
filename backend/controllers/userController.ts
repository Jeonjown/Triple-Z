import { Response, Request, NextFunction } from "express";
import { createError } from "../utils/createError";
import User from "../models/userModel";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {}
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
