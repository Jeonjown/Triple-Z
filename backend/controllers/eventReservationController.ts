import { Request, Response, NextFunction } from "express";
import { EventReservation } from "../models/eventReservationModel";
import { createError } from "../utils/createError";
import User from "../models/userModel";
import { EventSettings } from "../models/eventSettingsModel";

//  createReservation
export const createReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return next(createError("UserId is required in URL params", 400));
    }

    const {
      date,
      fullName,
      contactNumber,
      startTime,
      endTime,
      partySize,
      eventType,
      cart,
      specialRequest,
    } = req.body;

    // Validate required fields
    if (
      !date ||
      !fullName ||
      !contactNumber ||
      !startTime ||
      !endTime ||
      partySize === undefined ||
      !eventType ||
      !cart ||
      !Array.isArray(cart)
    ) {
      return next(createError("Missing required fields", 400));
    }

    // Fetch the user to ensure it exists
    const user = await User.findById(userId);
    if (!user) {
      return next(
        createError("User not found. Reservation cannot be created.", 404)
      );
    }

    // Calculate the total price of the cart
    const cartTotal = cart.reduce(
      (sum: number, item: { totalPrice: number }) => {
        return sum + item.totalPrice;
      },
      0
    );

    // Fetch event settings to retrieve the event fee
    const eventSettings = await EventSettings.findOne();
    if (!eventSettings) {
      return next(createError("Event settings not found", 500));
    }
    const eventFee = eventSettings.eventFee;

    // Calculate the overall total payment (cart total + event fee)
    const totalPayment = cartTotal + eventFee;

    // Create the reservation document including the totalPayment field
    const newReservation = new EventReservation({
      userId,
      fullName,
      contactNumber,
      partySize,
      date,
      startTime,
      endTime,
      eventType,
      cart,
      specialRequest,
      totalPayment,
    });

    // Save the reservation
    await newReservation.save();

    // Populate the user field for the response
    const populatedReservation = await EventReservation.findById(
      newReservation._id
    ).populate("userId", "username email", User);

    res.status(201).json({
      message: "Reservation created successfully!",
      reservation: populatedReservation,
    });
  } catch (error: any) {
    console.error(error);
    if (error.message.includes("Only 2 reservations are allowed")) {
      return next(createError(error.message, 400));
    }
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
    // Fetch reservations, sort by createdAt (newest first),
    // and populate the 'userId' field with username and email from the User model
    const reservations = await EventReservation.find()
      .sort({ createdAt: -1 })
      .populate("userId", "username email", User);

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
    const { eventStatus, reservationId } = req.body;

    // Validate status against the allowed enum values
    if (
      !["Pending", "Confirmed", "Completed", "Canceled"].includes(eventStatus)
    ) {
      return next(
        createError(
          "Invalid status. Valid statuses are: Pending, Confirmed, Completed, or Canceled.",
          400
        )
      );
    }

    // Find and update the reservation
    const updatedReservation = await EventReservation.findByIdAndUpdate(
      reservationId,
      { eventStatus },
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
