import { Request, Response, NextFunction } from "express";
import { createError } from "../utils/createError";
import { GroupReservation } from "../models/groupReservationModel";
import { EventSettings } from "../models/eventSettingsModel";
import { UnavailableDate } from "../models/unavailableDate"; // Import UnavailableDate model

export const validateGroupReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      date,
      fullName,
      contactNumber,
      startTime,
      endTime,
      partySize,
      cart,
    } = req.body;

    // 1. Validate required fields
    if (
      !date ||
      !fullName ||
      !contactNumber ||
      !startTime ||
      !endTime ||
      partySize === undefined ||
      !cart
    ) {
      return next(createError("Missing required fields", 400));
    }

    // 2. Validate Date Format
    const reservationDate = new Date(date);
    if (isNaN(reservationDate.getTime())) {
      return next(createError("Invalid date format", 400));
    }

    // 3. Validate Time Format (e.g., "1:00 AM" or "1:00 PM")
    const timePattern = /^([1-9]|1[0-2]):00\s?(AM|PM)$/;
    if (!timePattern.test(startTime)) {
      return next(
        createError("Start time must be in the format '1:00 AM'", 400)
      );
    }
    if (!timePattern.test(endTime)) {
      return next(createError("End time must be in the format '1:00 PM'", 400));
    }

    // 4. Validate cart is a non-empty array
    if (!Array.isArray(cart) || cart.length === 0) {
      return next(createError("Cart must be a non-empty array", 400));
    }

    // 5. Validate each cart item and its availability
    for (const item of cart) {
      if (
        !item._id ||
        !item.title ||
        typeof item.quantity !== "number" ||
        item.quantity < 1 ||
        item.quantity > 999 ||
        typeof item.price !== "number" ||
        typeof item.totalPrice !== "number" ||
        !item.image
      ) {
        return next(createError("Invalid cart item", 400));
      }
      // Reject if an item is explicitly unavailable.
      if (item.hasOwnProperty("availability") && item.availability === false) {
        return next(createError("Cart contains an unavailable item.", 400));
      }
    }

    // 6. Retrieve group reservation settings from EventSettings
    const settings = await EventSettings.findOne();
    if (!settings) {
      return next(
        createError("Group reservation settings not configured.", 500)
      );
    }

    // 7. Validate that the reservation date is not marked as unavailable
    // Create local start and end boundaries for the day
    const startOfLocalDay = new Date(
      reservationDate.getFullYear(),
      reservationDate.getMonth(),
      reservationDate.getDate()
    );
    const endOfLocalDay = new Date(
      reservationDate.getFullYear(),
      reservationDate.getMonth(),
      reservationDate.getDate() + 1
    );
    const unavailableRecord = await UnavailableDate.findOne({
      date: { $gte: startOfLocalDay, $lt: endOfLocalDay },
    });
    if (unavailableRecord) {
      return next(createError("The selected date is unavailable", 400));
    }

    // 8. Validate that the reservation date is at least groupMinDaysPrior in advance
    const now = new Date();
    const minValidDate = new Date(now);
    minValidDate.setDate(now.getDate() + settings.groupMinDaysPrior);

    // Normalize both dates to local date-only
    const reservationDateOnly = new Date(
      reservationDate.getFullYear(),
      reservationDate.getMonth(),
      reservationDate.getDate()
    );
    const minValidDateOnly = new Date(
      minValidDate.getFullYear(),
      minValidDate.getMonth(),
      minValidDate.getDate()
    );
    if (reservationDateOnly < minValidDateOnly) {
      return next(
        createError(
          `Reservations must be made at least ${settings.groupMinDaysPrior} day(s) in advance.`,
          400
        )
      );
    }

    // 9. Validate Group Minimum Reservation
    if (partySize < settings.groupMinReservation) {
      return next(
        createError(
          `Party size must be at least ${settings.groupMinReservation}.`,
          400
        )
      );
    }

    // 10. Validate Available Tables Considering Party Size
    // Define start and end of reservation day in local time
    const startOfDay = new Date(
      reservationDate.getFullYear(),
      reservationDate.getMonth(),
      reservationDate.getDate()
    );
    const endOfDay = new Date(
      reservationDate.getFullYear(),
      reservationDate.getMonth(),
      reservationDate.getDate() + 1
    );

    // Fetch all reservations for that day, excluding those that are cancelled.
    const reservations = await GroupReservation.find({
      date: { $gte: startOfDay, $lt: endOfDay },
      eventStatus: { $ne: "Cancelled" },
    });

    // Calculate total tables already booked on that day
    const existingTables = reservations.reduce((total, reservation) => {
      const tablesRequired = Math.ceil(
        reservation.partySize / settings.groupMaxGuestsPerTable
      );
      return total + tablesRequired;
    }, 0);

    // Calculate tables required for the current reservation
    const newPartyTables = Math.ceil(
      partySize / settings.groupMaxGuestsPerTable
    );

    // Check if the sum exceeds the maximum allowed tables per day
    if (existingTables + newPartyTables > settings.groupMaxTablesPerDay) {
      return next(
        createError(
          "Not enough available tables for your party on this day.",
          400
        )
      );
    }

    next();
  } catch (error: any) {
    next(createError(error.message || "Internal Server Error", 500));
  }
};
