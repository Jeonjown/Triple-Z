import { Request, Response, NextFunction } from "express";
import { EventSettings } from "../models/eventSettingsModel";
import { EventReservation } from "../models/eventReservationModel";
import { createError } from "../utils/createError";
import { UnavailableDate } from "../models/unavailableDate";
import { parse, format, addHours } from "date-fns";

export const validateEventReservation = async (
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
      estimatedEventDuration, // Changed from endTime
      partySize,
      eventType,
      cart,
    } = req.body;

    // 1. Validate required fields
    if (
      !date ||
      !fullName ||
      !contactNumber ||
      !startTime ||
      estimatedEventDuration === undefined || // Changed from !endTime
      partySize === undefined ||
      !eventType ||
      !cart
    ) {
      return next(createError("Missing required fields", 400));
    }

    // Validate estimatedEventDuration is a positive number
    if (
      typeof estimatedEventDuration !== "number" ||
      estimatedEventDuration <= 0
    ) {
      return next(
        createError("Estimated event duration must be a positive number.", 400)
      );
    }

    // 2. Validate Date Format
    const reservationDate = new Date(date);
    if (isNaN(reservationDate.getTime())) {
      return next(createError("Invalid date format", 400));
    }

    // 3. Validate Time Format (e.g., "1:00 AM")
    const timePattern = /^([1-9]|1[0-2]):00\s?(AM|PM)$/;
    if (!timePattern.test(startTime)) {
      return next(
        createError("Start time must be in the format '1:00 AM'", 400)
      );
    }
    // No need to validate endTime format anymore

    // Calculate endTime based on startTime and estimatedEventDuration
    const [startHourStr, startMinuteStr] = startTime.split(":");
    const startHour = parseInt(startHourStr, 10);
    const startMinute = parseInt(startMinuteStr.split(" ")[0], 10);
    const ampm = startTime.split(" ")[1];

    let adjustedStartHour = startHour;
    if (ampm === "PM" && startHour !== 12) {
      adjustedStartHour += 12;
    } else if (ampm === "AM" && startHour === 12) {
      adjustedStartHour = 0;
    }

    const startDate = new Date(date);
    startDate.setHours(adjustedStartHour, startMinute, 0, 0);
    const endDateCalculated = addHours(startDate, estimatedEventDuration);

    // Format endDate to a comparable format (you might not need this if comparing dates directly)
    const endHour = endDateCalculated.getHours();
    const endMinute = endDateCalculated.getMinutes();
    const endAMPM = endHour < 12 || endHour === 24 ? "AM" : "PM";
    const formattedEndHour = endHour % 12 === 0 ? 12 : endHour % 12;
    const endTime = `${formattedEndHour.toString().padStart(2, "0")}:${endMinute
      .toString()
      .padStart(2, "0")} ${endAMPM}`;

    // 4. Validate cart is a non-empty array
    if (!Array.isArray(cart) || cart.length === 0) {
      return next(createError("Cart must be a non-empty array", 400));
    }
    // Validate each cart item and check if any item is marked unavailable
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
      if (item.availability === false) {
        return next(createError("Cart contains an unavailable item.", 400));
      }
    }

    // 5. Retrieve event settings for dynamic validations
    const settings = await EventSettings.findOne();
    if (!settings) {
      return next(createError("Event settings not configured.", 500));
    }

    const now = new Date();
    // Calculate the minimum valid date by adding eventMinDaysPrior days
    const minValidDate = new Date(now);
    minValidDate.setDate(now.getDate() + settings.eventMinDaysPrior);

    // Normalize dates to compare only the date part
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

    // 6. Validate reservation is made at least eventMinDaysPrior days in advance
    if (reservationDateOnly < minValidDateOnly) {
      return next(
        createError(
          `Reservations must be made at least ${settings.eventMinDaysPrior} days in advance.`,
          400
        )
      );
    }

    // 7. Validate partySize meets minimum and does not exceed maximum guest requirements
    if (settings.eventMinGuests && partySize < settings.eventMinGuests) {
      return next(
        createError(
          `Party size must be at least ${settings.eventMinGuests}.`,
          400
        )
      );
    }
    if (settings.eventMaxGuests && partySize > settings.eventMaxGuests) {
      return next(
        createError(
          `Party size must be at most ${settings.eventMaxGuests}.`,
          400
        )
      );
    }

    // 8. Validate minimum package order: total quantity in cart must meet the minimum
    const totalPackagesOrdered = cart.reduce(
      (acc: number, item: { quantity: number }) => acc + item.quantity,
      0
    );
    if (
      settings.eventMinPackageOrder &&
      totalPackagesOrdered < settings.eventMinPackageOrder
    ) {
      return next(
        createError(
          `Minimum Event Meals order of ${settings.eventMinPackageOrder} is required.`,
          400
        )
      );
    }

    // NEW 9. Validate that the reservation date is not among the unavailable dates.
    // Assumes that the UnavailableDate model returns documents with a "date" field.
    const unavailableDates = await UnavailableDate.find({});
    const isUnavailable = unavailableDates.some((item) => {
      const itemDate = new Date(item.date);
      const normalizedItemDate = new Date(
        itemDate.getFullYear(),
        itemDate.getMonth(),
        itemDate.getDate()
      );
      return normalizedItemDate.getTime() === reservationDateOnly.getTime();
    });
    if (isUnavailable) {
      return next(
        createError(
          "The selected date is unavailable. Please choose another date.",
          400
        )
      );
    }

    // NEW 10. Validate Reservation Conflict: ignore reservations with eventStatus "Cancelled"
    // Normalize the selected date (date only) for the entire day
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

    // Parse startTime and endTime for conflict checking
    const startTimeDate = parse(
      `${date} ${startTime}`,
      "yyyy-MM-dd h:mm a",
      new Date()
    );
    const endTimeDate = parse(
      `${date} ${endTime}`,
      "yyyy-MM-dd h:mm a",
      new Date()
    ); // Using the calculated endTime

    // Query for any existing reservations on the same day that are NOT cancelled
    const conflictingReservation = await EventReservation.findOne({
      date: { $gte: startOfDay, $lt: endOfDay },
      eventStatus: { $ne: "Cancelled" },
      $or: [
        {
          // Proposed reservation starts within an existing reservation
          startTime: { $lte: format(startTimeDate, "HH:mm") },
          endTime: { $gte: format(startTimeDate, "HH:mm") },
        },
        {
          // Proposed reservation ends within an existing reservation
          startTime: { $lte: format(endTimeDate, "HH:mm") },
          endTime: { $gte: format(endTimeDate, "HH:mm") },
        },
        {
          // Existing reservation is fully contained within the proposed reservation
          startTime: { $gte: format(startTimeDate, "HH:mm") },
          endTime: { $lte: format(endTimeDate, "HH:mm") },
        },
      ],
    });

    if (conflictingReservation) {
      return next(
        createError(
          "The selected time slot conflicts with an existing reservation. Please choose another time.",
          400
        )
      );
    }

    next();
  } catch (error: any) {
    next(createError(error.message || "Internal Server Error", 500));
  }
};
