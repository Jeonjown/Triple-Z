// groupReservationController.ts
import { Request, Response, NextFunction } from "express";
import { GroupReservation } from "../models/groupReservationModel";
import { createError } from "../utils/createError";
import { format } from "date-fns";
import User from "../models/userModel";
import { EventSettings } from "../models/eventSettingsModel";
import { createNotification } from "./notificationController";

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

    // Destructure required fields from the request body.
    const {
      date,
      fullName,
      contactNumber,
      startTime,
      endTime,
      partySize,
      cart,
    } = req.body;

    // Validate required fields.
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

    // Verify that the user exists.
    const user = await User.findById(userId);
    if (!user) {
      return next(
        createError("User not found. Reservation cannot be created.", 404)
      );
    }

    // NEW STEP: Check if the user has an upcoming unfinished reservation.
    const existingReservation = await GroupReservation.findOne({
      userId,
      date: { $gte: new Date() },
      eventStatus: { $in: ["Pending", "Confirmed"] },
    });
    if (existingReservation) {
      return next(
        createError(
          "You already have an upcoming reservation. Please complete or cancel it before creating a new one.",
          400
        )
      );
    }

    // Calculate the total cart value.
    const cartTotal = cart.reduce(
      (sum: number, item: { totalPrice: number }) => sum + item.totalPrice,
      0
    );

    // Removed event fee: totalPayment is now just the cart total.
    const totalPayment = cartTotal;

    // Create a new group reservation with the provided details.
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
      totalPayment,
    });

    await newReservation.save();

    // Populate the user field for the response.
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
    const now = new Date();

    // --- Auto-Complete Process ---
    // Conditions:
    //   - Date is past.
    //   - eventStatus is "Confirmed".
    //   - paymentStatus is "Paid".
    const completeReservations = await GroupReservation.find({
      date: { $lt: now },
      eventStatus: "Confirmed",
      paymentStatus: "Paid",
    });
    if (completeReservations.length > 0) {
      const completeIds = completeReservations.map((r) => r._id);
      await GroupReservation.updateMany(
        { _id: { $in: completeIds } },
        { eventStatus: "Completed" }
      );
      console.log(
        `Auto-updated ${completeReservations.length} reservations to Completed.`
      );
      for (const reservation of completeReservations) {
        const fakeReq = {
          body: {
            title: "Group Reservation Completed",
            description: `Your group reservation on ${format(
              reservation.date,
              "MMMM dd, yyyy"
            )} has been marked as Completed.`,
            userId: String(reservation.userId),
            redirectUrl: "/profile",
          },
        } as Request;
        const fakeRes = {
          status: () => ({ json: () => {} }),
        } as unknown as Response;
        await createNotification(fakeReq, fakeRes, next);
      }
    }

    // --- Auto-Cancel Process ---
    // Conditions:
    //   - Date is past.
    //   - eventStatus is "Pending".
    //   - paymentStatus is neither "Paid" nor "Partially Paid".
    const cancelReservations = await GroupReservation.find({
      date: { $lt: now },
      eventStatus: "Pending",
      paymentStatus: { $nin: ["Paid", "Partially Paid"] },
    });
    if (cancelReservations.length > 0) {
      const cancelIds = cancelReservations.map((r) => r._id);
      await GroupReservation.updateMany(
        { _id: { $in: cancelIds } },
        { eventStatus: "Cancelled" }
      );
      console.log(
        `Auto-updated ${cancelReservations.length} pending reservations to Cancelled.`
      );
      for (const reservation of cancelReservations) {
        const fakeReq = {
          body: {
            title: "Group Reservation Cancelled",
            description: `Your group reservation on ${format(
              reservation.date,
              "MMMM dd, yyyy"
            )} has been cancelled as it was not confirmed.`,
            userId: String(reservation.userId),
            redirectUrl: "/profile",
          },
        } as Request;
        const fakeRes = {
          status: () => ({ json: () => {} }),
        } as unknown as Response;
        await createNotification(fakeReq, fakeRes, next);
      }
    }

    // Fetch all group reservations after auto-updates
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

export const adminRescheduleGroupReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { reservationId, ...updateData } = req.body;
    if (!reservationId) {
      return next(
        createError("ReservationId is required in the request body.", 400)
      );
    }

    // Step 1: Fetch the current group reservation.
    const currentReservation = await GroupReservation.findById(reservationId);
    if (!currentReservation) {
      return next(createError("Group reservation not found.", 404));
    }

    // Step 2: Filter only scheduling-related fields.
    const allowedUpdates = ["date", "startTime", "endTime"];
    const filteredUpdates = Object.keys(updateData).reduce((acc, key) => {
      if (allowedUpdates.includes(key)) {
        acc[key] = updateData[key];
      }
      return acc;
    }, {} as Record<string, any>);

    // Step 3: Update the reservation.
    const updatedReservation = await GroupReservation.findByIdAndUpdate(
      reservationId,
      { $set: filteredUpdates },
      { new: true }
    );
    if (!updatedReservation) {
      return next(createError("Group reservation not found.", 404));
    }

    // Step 4: Log which fields have changed.
    let changes: string[] = [];
    Object.keys(filteredUpdates).forEach((key) => {
      const oldValue = String((currentReservation as any)[key]);
      const newValue = String(filteredUpdates[key]);
      if (oldValue !== newValue) {
        changes.push(`${key} changed from "${oldValue}" to "${newValue}"`);
      }
    });
    console.log(
      changes.length
        ? `Changes made: ${changes.join(", ")}.`
        : "No scheduling changes were detected."
    );

    // Step 5: Populate user details before returning.
    const populatedReservation = await GroupReservation.findById(
      updatedReservation._id
    ).populate("userId", "username email", User);

    res.status(200).json({
      message: "Group reservation rescheduled successfully!",
      reservation: populatedReservation,
    });
  } catch (error) {
    console.error(error);
    next(createError("Failed to reschedule group reservation.", 500));
  }
};
