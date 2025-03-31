import { Request, Response, NextFunction } from "express";

import { createError } from "../utils/createError";
import { UnavailableDate } from "../models/unavailableDate";

// Mark a date as not available
export const markDateNotAvailable = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { date, reason } = req.body;
    if (!date) {
      return next(createError("Date is required.", 400));
    }

    // Parse the provided date and validate it.
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return next(createError("Invalid date format.", 400));
    }

    // Check if this date is already marked as unavailable.
    const existing = await UnavailableDate.findOne({ date: parsedDate });
    if (existing) {
      return next(
        createError("This date is already marked as not available.", 400)
      );
    }

    // Create and save a new unavailable date record.
    const newUnavailableDate = new UnavailableDate({
      date: parsedDate,
      reason: reason || "Not available",
    });
    await newUnavailableDate.save();

    res.status(201).json({
      message: "Date marked as not available successfully!",
      date: newUnavailableDate,
    });
  } catch (error) {
    console.error(error);
    next(createError("Failed to mark date as not available.", 500));
  }
};

// Unmark a date as not available (remove it)
export const unmarkDateNotAvailable = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(createError("ID is required.", 400));
    }

    // Remove the unavailable date record by its ID.
    const removedDate = await UnavailableDate.findByIdAndDelete(id);
    if (!removedDate) {
      return next(createError("Unavailable date not found.", 404));
    }

    res.status(200).json({
      message: "Date unmarked successfully!",
      date: removedDate,
    });
  } catch (error) {
    console.error(error);
    next(createError("Failed to unmark date as not available.", 500));
  }
};

// Get all unavailable dates
export const getAllUnavailableDates = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const dates = await UnavailableDate.find().sort({ date: 1 });
    res.status(200).json({
      message: "Unavailable dates fetched successfully!",
      dates,
    });
  } catch (error) {
    console.error(error);
    next(createError("Failed to fetch unavailable dates.", 500));
  }
};
