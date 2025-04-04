import { Request, Response, NextFunction } from "express";
import { EventReservation } from "../models/eventReservationModel";
import { createError } from "../utils/createError";
import User from "../models/userModel";
import { EventSettings } from "../models/eventSettingsModel";
import { differenceInDays, format, isBefore, parse, subHours } from "date-fns";
import { createNotification } from "./notificationController";
import { GroupReservation } from "../models/groupReservationModel";

// createReservation
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
      isCorkage,
    } = req.body;

    if (
      !date ||
      !fullName ||
      !contactNumber ||
      !startTime ||
      !endTime ||
      partySize === undefined ||
      !eventType ||
      !cart ||
      !Array.isArray(cart) ||
      isCorkage === undefined
    ) {
      return next(createError("Missing required fields", 400));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(
        createError("User not found. Reservation cannot be created.", 404)
      );
    }

    // Step 2: Check if there's an upcoming reservation for this user
    const existingReservation = await EventReservation.findOne({
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

    const cartTotal = cart.reduce(
      (sum: number, item: { totalPrice: number }) => sum + item.totalPrice,
      0
    );

    const eventSettings = await EventSettings.findOne();
    if (!eventSettings) {
      return next(createError("Event settings not found", 500));
    }

    const eventFee = Number(eventSettings.eventFee);
    const corkageFee = Number(eventSettings.eventCorkageFee);
    if (isNaN(eventFee) || isNaN(corkageFee)) {
      return next(createError("Invalid fee values in event settings", 500));
    }

    const totalPayment = cartTotal + eventFee + (isCorkage ? corkageFee : 0);

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
      eventFee,
      isCorkage,
      subtotal: cartTotal,
      totalPayment,
    });

    await newReservation.save();

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

// Controller to get all reservations with auto‑update and notifications
export const getReservations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const now = new Date();

    // --- Process Confirmed Reservations (Auto-Complete) ---
    // Conditions: date is past, eventStatus is "Confirmed", and paymentStatus is "Paid".
    const confirmedReservations = await EventReservation.find({
      date: { $lt: now },
      eventStatus: "Confirmed",
      paymentStatus: "Paid",
    });
    if (confirmedReservations.length > 0) {
      const confirmedIds = confirmedReservations.map((r) => r._id);
      await EventReservation.updateMany(
        { _id: { $in: confirmedIds } },
        { eventStatus: "Completed" }
      );
      console.log(
        `Auto-updated ${confirmedReservations.length} confirmed reservations to Completed.`
      );
      for (const reservation of confirmedReservations) {
        const fakeReq = {
          body: {
            title: "Reservation Completed",
            description: `Your reservation on ${format(
              reservation.date,
              "MMMM dd, yyyy"
            )} has been automatically marked as Completed.`,
            userId: String(reservation.userId),
            redirectUrl: "/profile",
          },
        } as Request;
        const fakeRes = {
          status: () => ({
            json: () => {},
          }),
        } as unknown as Response;
        await createNotification(fakeReq, fakeRes, next);
      }
    }

    // --- Process Pending Reservations (Auto-Cancel) ---
    // Conditions: date is past, eventStatus is "Pending", and paymentStatus is NOT "Paid" nor "Partially Paid".
    const pendingReservations = await EventReservation.find({
      date: { $lt: now },
      eventStatus: "Pending",
      paymentStatus: { $nin: ["Paid", "Partially Paid"] },
    });
    if (pendingReservations.length > 0) {
      const pendingIds = pendingReservations.map((r) => r._id);
      await EventReservation.updateMany(
        { _id: { $in: pendingIds } },
        { eventStatus: "Cancelled" }
      );
      console.log(
        `Auto-updated ${pendingReservations.length} pending reservations to Cancelled.`
      );
      for (const reservation of pendingReservations) {
        const fakeReq = {
          body: {
            title: "Reservation Cancelled",
            description: `Your reservation on ${format(
              reservation.date,
              "MMMM dd, yyyy"
            )} has been automatically cancelled as it was not confirmed.`,
            userId: String(reservation.userId),
            redirectUrl: "/profile",
          },
        } as Request;
        const fakeRes = {
          status: () => ({
            json: () => {},
          }),
        } as unknown as Response;
        await createNotification(fakeReq, fakeRes, next);
      }
    }

    // Fetch all reservations after auto-updates
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

// Update payment status
export const updatePaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentStatus, reservationId } = req.body;

    if (!["Not Paid", "Partially Paid", "Paid"].includes(paymentStatus)) {
      return next(
        createError(
          "Invalid payment status. Valid statuses are: Not Paid, Partially Paid, or Paid.",
          400
        )
      );
    }

    const updatedReservation = await EventReservation.findByIdAndUpdate(
      reservationId,
      { paymentStatus },
      { new: true }
    );
    if (!updatedReservation) {
      return next(createError("Reservation not found.", 404));
    }

    res.status(200).json({
      message: "Reservation payment status updated successfully!",
      reservation: updatedReservation,
    });
  } catch (error) {
    console.error(error);
    next(createError("Failed to update reservation payment status.", 500));
  }
};

// Delete a reservation
export const deleteReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reservationId } = req.body;

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

// Admin controller to update a user reservation (notification removed)
export const adminRescheduleEventReservation = async (
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

    // Step 1: Fetch the current reservation for comparison.
    const currentReservation = await EventReservation.findById(reservationId);
    if (!currentReservation) {
      return next(createError("Reservation not found.", 404));
    }

    // Step 2: Filter only the scheduling-related fields for rescheduling.
    const allowedUpdates = ["date", "startTime", "endTime"];
    const filteredUpdates = Object.keys(updateData).reduce((acc, key) => {
      if (allowedUpdates.includes(key)) {
        acc[key] = updateData[key];
      }
      return acc;
    }, {} as Record<string, any>);

    // Step 3: Update the reservation.
    const updatedReservation = await EventReservation.findByIdAndUpdate(
      reservationId,
      { $set: filteredUpdates },
      { new: true }
    );
    if (!updatedReservation) {
      return next(createError("Reservation not found.", 404));
    }

    // Step 4: Determine what scheduling fields have changed.
    let changes: string[] = [];
    Object.keys(filteredUpdates).forEach((key) => {
      // Cast currentReservation to any for dynamic property access.
      const oldValue = String((currentReservation as any)[key]);
      const newValue = String(filteredUpdates[key]);
      if (oldValue !== newValue) {
        changes.push(`${key} changed from "${oldValue}" to "${newValue}"`);
      }
    });

    const changesDescription = changes.length
      ? `The following changes were made: ${changes.join(", ")}.`
      : "No changes were detected.";
    console.log(changesDescription);

    // Step 5: Populate the reservation with user details and return it.
    const populatedReservation = await EventReservation.findById(
      updatedReservation._id
    ).populate("userId", "username email", User);

    res.status(200).json({
      message: "Reservation rescheduled successfully!",
      reservation: populatedReservation,
    });
  } catch (error) {
    console.error(error);
    next(createError("Failed to reschedule reservation.", 500));
  }
};

export const getAllReservations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Fetch individual event reservations.
    const eventReservations = await EventReservation.find().populate(
      "userId",
      "username email",
      User
    );

    // Fetch group reservations.
    const groupReservations = await GroupReservation.find().populate(
      "userId",
      "username email",
      User
    );

    // Merge both arrays.
    const allReservations = [...eventReservations, ...groupReservations];

    // Sort by the 'createdAt' field in descending order (most recent first).
    allReservations.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.status(200).json({
      message: "Reservations fetched successfully!",
      reservations: allReservations,
    });
  } catch (error) {
    console.error(error);
    next(createError("Failed to fetch reservations.", 500));
  }
};

export const cancelReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { reservationId } = req.body;
    // Fetch the reservation (it can be Event or Group based on your implementation)
    let reservation = await EventReservation.findById(reservationId);
    let reservationType = "Event";
    if (!reservation) {
      reservation = await GroupReservation.findById(reservationId);
      reservationType = "Groups";
    }
    if (!reservation) {
      return next(createError("Reservation not found.", 404));
    }

    const now = new Date();
    const reservationDate = new Date(reservation.date);

    // Apply cancellation rules based on reservation type.
    if (reservationType === "Event") {
      // Check if the difference is at least 7 days.
      const daysDifference = differenceInDays(reservationDate, now);
      if (daysDifference < 7) {
        return next(
          createError(
            "Event reservations must be cancelled at least 1 week in advance.",
            400
          )
        );
      }
    } else if (reservationType === "Groups") {
      // For Groups, cancellation is allowed only if it's at least 3 hours before the openingHours.
      const eventSettings = await EventSettings.findOne();
      if (!eventSettings) {
        return next(createError("Event settings not found", 500));
      }
      // Parse openingHours (e.g., "4:00 PM") into a Date object based on the reservationDate.
      const openingTime = parse(
        eventSettings.openingHours,
        "h:mm a",
        reservationDate
      );
      // Calculate cutoff: 3 hours before openingTime.
      const cutoffTime = subHours(openingTime, 3);
      if (!isBefore(now, cutoffTime)) {
        return next(
          createError(
            "Group reservations can only be cancelled at least 3 hours before opening time.",
            400
          )
        );
      }
    }

    // If rules pass, update the reservation status to "Cancelled".
    reservation.eventStatus = "Cancelled";
    await reservation.save();

    res.status(200).json({
      message: "Reservation cancelled successfully!",
      reservation,
    });
  } catch (error) {
    console.error(error);
    next(createError("Failed to cancel reservation.", 500));
  }
};

export const getAllReservationsForUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return next(createError("User ID is required in the URL.", 400));
    }

    // Fetch individual event reservations for the specific user.
    const eventReservations = await EventReservation.find({ userId }).populate(
      "userId",
      "username email",
      User
    );

    // Fetch group reservations for the specific user.
    const groupReservations = await GroupReservation.find({ userId }).populate(
      "userId",
      "username email",
      User
    );

    // Merge both arrays.
    const allReservations = [...eventReservations, ...groupReservations];

    // Sort by the 'createdAt' field in descending order (most recent first).
    allReservations.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.status(200).json({
      message: "User reservations fetched successfully!",
      reservations: allReservations,
    });
  } catch (error) {
    console.error(error);
    next(createError("Failed to fetch user reservations.", 500));
  }
};
