import { Request, Response, NextFunction } from "express";
import { EventReservation } from "../models/eventReservationModel";
import { EventSettings } from "../models/eventSettingsModel";

/**
 * Middleware to validate an event reservation request.
 * - Checks if a reservation date is provided.
 * - Retrieves event settings to determine the minimum days in advance (minDaysPrior)
 *   and maximum allowed reservations per month (eventReservationLimit).
 * - Validates that the reservation date is at least minDaysPrior days ahead.
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
      res.status(400).json({
        success: false,
        message: "Reservation date is required.",
      });
      return;
    }

    // 2. Convert the provided date to a Date object.
    const reservationDate = new Date(date);
    const now = new Date();

    // 3. Retrieve event settings.
    const settings = await EventSettings.findOne();
    if (!settings) {
      res.status(500).json({
        success: false,
        message: "Event settings not configured.",
      });
      return;
    }

    // 4. Calculate the minimum valid date using settings.minDaysPrior.
    const minValidDate = new Date(now);
    minValidDate.setDate(now.getDate() + settings.minDaysPrior);

    if (reservationDate < minValidDate) {
      res.status(400).json({
        success: false,
        message: `Reservations must be made at least ${settings.minDaysPrior} days in advance.`,
      });
      return;
    }

    // 5. Calculate start and end of the month for the reservation date.
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
      res.status(400).json({
        success: false,
        message: `Only ${settings.eventReservationLimit} reservations are allowed per month.`,
      });
      return;
    }

    // 7. Check for an existing reservation on the exact same date.
    const existingReservation = await EventReservation.findOne({
      date: reservationDate,
    });
    if (existingReservation) {
      res.status(400).json({
        success: false,
        message: "This date has already been reserved.",
      });
      return;
    }

    // 8. If all validations pass, move to the next middleware/controller.
    next();
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
