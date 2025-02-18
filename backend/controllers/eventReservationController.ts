import { Request, Response, NextFunction } from "express";
import { EventReservation } from "../models/eventReservationModel";
import { createError } from "../utils/createError";
import User from "../models/userModel";
import { isReservationDateValid } from "../utils/isReservationValid";

//  createReservation
export const createReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params; // Assuming the ownerId is in the request params
    console.log(req.body);
    if (!userId) {
      return next(createError("OwnerId is required in URL params", 400));
    }

    const {
      date,
      fullName,
      contactNumber,
      startTime,
      endTime,
      partySize,
      eventType,
      status,
    } = req.body;

    if (
      !date ||
      !fullName ||
      !contactNumber ||
      !startTime ||
      !endTime ||
      partySize === undefined ||
      !eventType ||
      !status
    ) {
      return next(createError("Missing required fields", 400));
    }

    // Catch the specific error from isReservationDateValid
    try {
      const isValid = await isReservationDateValid(date);
      if (!isValid) {
        return next(
          createError("Events Reservations accommodated are 2 per month", 400)
        );
      }
    } catch (error: any) {
      return next(
        createError(error.message || "Failed to validate reservation date", 400)
      );
    }

    // Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return next(
        createError("User not found. Reservation cannot be created.", 404)
      );
    }

    // Create the reservation
    const newReservation = new EventReservation({
      user: user._id,
      date,
      fullName,
      contactNumber,
      startTime,
      endTime,
      partySize,
      eventType,
      status,
    });

    // Save the reservation
    await newReservation.save();

    // Populate the 'user' field with username and email after saving the reservation
    const populatedReservation = await EventReservation.findById(
      newReservation._id
    ).populate("user", "username email", User);

    res.status(201).json({
      message: "Reservation created successfully!",
      reservation: populatedReservation,
    });
  } catch (error: any) {
    console.error(error);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return next(
        createError("A reservation with this email already exists.", 400)
      );
    }

    next(createError("Failed to create reservation.", 500));
  }
};
// Controller to get all reservations
export const getReservations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Populate the 'user' field with username and email
    const reservations = await EventReservation.find().populate(
      "user",
      "username email",
      User
    );

    res.status(200).json({
      message: "Reservations fetched successfully!",
      reservations,
    });
  } catch (error) {
    console.error(error);
    next(createError("Failed to fetch reservations.", 500));
  }
};

// Update a reservation's status (confirming, canceling, or completing)
export const updateReservationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reservationId } = req.params;
    const { status } = req.body;

    // Validate status against the allowed enum values
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
  } catch (error) {
    console.error(error);
    next(createError("Failed to update reservation status.", 500));
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
  } catch (error) {
    console.error(error);
    next(createError("Failed to delete reservation.", 500));
  }
};
