// groupReservationController.ts
import { Request, Response, NextFunction } from "express";
import { GroupReservation } from "../models/groupReservationModel";
import { createError } from "../utils/createError";
import User from "../models/userModel";
import { EventSettings } from "../models/eventSettingsModel";

// Create a group reservation
export const createGroupReservation = async (
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
      cart,
    } = req.body;

    // Validate required fields
    if (
      !date ||
      !fullName ||
      !contactNumber ||
      !startTime ||
      !endTime ||
      partySize === undefined ||
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
      (sum: number, item: { totalPrice: number }) => sum + item.totalPrice,
      0
    );

    // Fetch settings to retrieve the fee
    const eventSettings = await EventSettings.findOne();
    if (!eventSettings) {
      return next(createError("Event settings not found", 500));
    }
    const eventFee = eventSettings.eventFee;

    // Calculate the overall total payment (cart total + fee)
    const totalPayment = cartTotal + eventFee;

    // Create the group reservation document
    const newReservation = new GroupReservation({
      userId,
      fullName,
      contactNumber,
      partySize,
      date,
      startTime,
      endTime,
      cart,
      subtotal: cartTotal,
      eventFee,
      totalPayment,
    });

    // Save the reservation
    await newReservation.save();

    // Populate the user field for the response
    const populatedReservation = await GroupReservation.findById(
      newReservation._id
    ).populate("userId", "username email", User);

    res.status(201).json({
      message: "Group reservation created successfully!",
      reservation: populatedReservation,
    });
  } catch (error: any) {
    console.error(error);
    next(createError("Failed to create group reservation.", 500));
  }
};

// Get all group reservations
export const getGroupReservations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reservations = await GroupReservation.find()
      .sort({ createdAt: -1 })
      .populate("userId", "username email", User);

    res.status(200).json({
      message: "Group reservations fetched successfully!",
      reservations,
    });
  } catch (error) {
    console.error(error);
    next(createError("Failed to fetch group reservations.", 500));
  }
};

// Update group reservation status
export const updateGroupReservationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eventStatus, reservationId } = req.body;

    // Validate status against allowed values
    if (
      !["Pending", "Confirmed", "Completed", "Cancelled"].includes(eventStatus)
    ) {
      return next(
        createError(
          "Invalid status. Valid statuses are: Pending, Confirmed, Completed, or Cancelled.",
          400
        )
      );
    }

    const updatedReservation = await GroupReservation.findByIdAndUpdate(
      reservationId,
      { eventStatus },
      { new: true }
    );

    if (!updatedReservation) {
      return next(createError("Group reservation not found.", 404));
    }

    res.status(200).json({
      message: "Group reservation status updated successfully!",
      reservation: updatedReservation,
    });
  } catch (error) {
    console.error(error);
    next(createError("Failed to update group reservation status.", 500));
  }
};

// Update group reservation payment status
export const updateGroupPaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { paymentStatus, reservationId } = req.body;

    // Validate allowed payment statuses
    if (!["Not Paid", "Partially Paid", "Paid"].includes(paymentStatus)) {
      return next(
        createError(
          "Invalid payment status. Valid statuses are: Not Paid, Partially Paid, or Paid.",
          400
        )
      );
    }

    const updatedReservation = await GroupReservation.findByIdAndUpdate(
      reservationId,
      { paymentStatus },
      { new: true }
    );

    if (!updatedReservation) {
      return next(createError("Group reservation not found.", 404));
    }

    res.status(200).json({
      message: "Group reservation payment status updated successfully!",
      reservation: updatedReservation,
    });
  } catch (error) {
    console.error(error);
    next(
      createError("Failed to update group reservation payment status.", 500)
    );
  }
};

// Delete a group reservation
export const deleteGroupReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { reservationId } = req.body;

    const deletedReservation = await GroupReservation.findByIdAndDelete(
      reservationId
    );

    if (!deletedReservation) {
      return next(createError("Group reservation not found.", 404));
    }

    res.status(200).json({
      message: "Group reservation deleted successfully!",
      reservation: deletedReservation,
    });
  } catch (error) {
    console.error(error);
    next(createError("Failed to delete group reservation.", 500));
  }
};
