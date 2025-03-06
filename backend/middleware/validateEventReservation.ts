import { Request, Response, NextFunction } from "express";
import { EventReservation } from "../models/eventReservationModel";
import { EventSettings } from "../models/eventSettingsModel";
import { createError } from "../utils/createError";

/**
 * Middleware to validate an event reservation request.
 * - Checks if a reservation date is provided.
 * - Retrieves event settings to determine the minimum days in advance (eventMinDaysPrior)
 *   and maximum allowed reservations per month (eventReservationLimit).
 * - Validates that the reservation date is at least eventMinDaysPrior days ahead.
 * - Ensures that the monthly reservations count is below eventReservationLimit.
 * - Prevents duplicate reservations on the same date.
 */
export const validateEventReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Ensure a reservation date is provided.
    const { date } = req.body;
    if (!date) {
      return next(createError("Reservation date is required.", 400));
    }

    // 2. Convert the provided date to a Date object.
    const reservationDate = new Date(date);
    const now = new Date();

    // 3. Retrieve event settings.
    const settings = await EventSettings.findOne();
    if (!settings) {
      return next(createError("Event settings not configured.", 500));
    }

    // 4. Calculate the minimum valid date using settings.eventMinDaysPrior.
    const minValidDate = new Date(now);
    minValidDate.setDate(now.getDate() + settings.eventMinDaysPrior);

    if (reservationDate < minValidDate) {
      return next(
        createError(
          `Reservations must be made at least ${settings.eventMinDaysPrior} days in advance.`,
          400
        )
      );
    }

    // 5. Calculate the start and end of the month for the reservation date.
    const startOfMonth = new Date(
      reservationDate.getFullYear(),
      reservationDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      reservationDate.getFullYear(),
      reservationDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    // 6. Count how many reservations exist in the same month.
    const reservationsCount = await EventReservation.countDocuments({
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    if (reservationsCount >= settings.eventReservationLimit) {
      return next(
        createError(
          `Only ${settings.eventReservationLimit} reservations are allowed per month.`,
          400
        )
      );
    }

    // 7. Check for an existing reservation on the exact same date.
    const existingReservation = await EventReservation.findOne({
      date: reservationDate,
    });
    if (existingReservation) {
      return next(createError("This date has already been reserved.", 400));
    }

    // 8. If all validations pass, move to the next middleware/controller.
    next();
  } catch (error: any) {
    next(createError(error.message || "Internal Server Error", 500));
  }
};
