import { Request, Response, NextFunction } from "express";
import { EventReservation } from "../models/eventReservationModel";
import { EventSettings } from "../models/eventSettingsModel";
import { createError } from "../utils/createError";

export const validateEventReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { date } = req.body;
    if (!date) {
      return next(createError("Reservation date is required.", 400));
    }

    // Convert the provided date to a Date object.
    const reservationDate = new Date(date);
    const now = new Date();

    // Retrieve event settings.
    const settings = await EventSettings.findOne();
    if (!settings) {
      return next(createError("Event settings not configured.", 500));
    }

    // Calculate the minimum valid date by adding eventMinDaysPrior days.
    const minValidDate = new Date(now);
    minValidDate.setDate(now.getDate() + settings.eventMinDaysPrior);

    // Normalize both dates (set time to midnight) to compare only the date parts.
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
          `Reservations must be made at least ${settings.eventMinDaysPrior} days in advance.`,
          400
        )
      );
    }

    // (Additional validations for monthly limits and duplicate dates would follow here)

    next();
  } catch (error: any) {
    next(createError(error.message || "Internal Server Error", 500));
  }
};
