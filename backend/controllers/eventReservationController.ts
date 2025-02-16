import { Request, Response, NextFunction } from "express";
import { EventReservation } from "../models/eventReservationModel";
import { createError } from "../utils/createError";
import User from "../models/userModel";

// Create a new event reservation
export const createReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params; // Capture the userId from the route parameter
    const {
      date,
      fullName,
      contactNumber,
      startTime,
      endTime,
      guests,
      eventType,
      status,
    } = req.body;

    // Check if the user exists in the userDB
    const user = await User.findById(userId);
    if (!user) {
      return next(
        createError("User not found. Reservation cannot be created.", 404)
      );
    }

    // Create a new reservation using the updated model fields
    const newReservation = new EventReservation({
      user: userId,
      date,
      fullName,
      contactNumber,
      startTime,
      endTime,
      guests,
      eventType,
      status,
    });

    // Save the reservation
    await newReservation.save();
    res.status(201).json({
      message: "Reservation created successfully!",
      reservation: newReservation,
    });
    return;
  } catch (error) {
    console.error(error);
    return next(createError("Failed to create reservation.", 500));
  }
};

// Controller to get all reservations
export const getReservations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Populate the 'user' field using the User model from the correct connection
    const reservations = await EventReservation.find().populate(
      "user",
      "username email",
      User
    );

    res.status(200).json({
      message: "Reservations fetched successfully!",
      reservations,
    });
    return;
  } catch (error) {
    console.error(error);
    return next(createError("Failed to fetch reservations.", 500));
  }
};

// Update a reservation's status (confirming, canceling, or completing)
export const updateReservationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reservationId } = req.params; // Get reservation ID from URL params
    const { status } = req.body; // Get new status from request body

    // Validate status against the updated enum
    if (!["pending", "confirmed", "completed", "canceled"].includes(status)) {
      return next(
        createError(
          "Invalid status. Valid statuses are: pending, confirmed, completed, or canceled.",
          400
        )
      );
    }

    // Find and update the reservation
    const updatedReservation = await EventReservation.findByIdAndUpdate(
      reservationId,
      { status },
      { new: true }
    );

    if (!updatedReservation) {
      return next(createError("Reservation not found.", 404));
    }

    res.status(200).json({
      message: "Reservation status updated successfully!",
      reservation: updatedReservation,
    });
    return;
  } catch (error) {
    console.error(error);
    return next(createError("Failed to update reservation status.", 500));
  }
};

// Delete a reservation
export const deleteReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reservationId } = req.params;

    // Delete the reservation
    const deletedReservation = await EventReservation.findByIdAndDelete(
      reservationId
    );

    if (!deletedReservation) {
      return next(createError("Reservation not found.", 404));
    }

    res.status(200).json({
      message: "Reservation deleted successfully!",
      reservation: deletedReservation,
    });
    return;
  } catch (error) {
    console.error(error);
    return next(createError("Failed to delete reservation.", 500));
  }
};
