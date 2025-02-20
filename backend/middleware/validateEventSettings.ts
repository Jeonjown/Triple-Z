import validator from "validator";
import { Request, Response, NextFunction } from "express";

export const validateEventSettings = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors: { field: string; message: string }[] = [];

  const {
    eventReservationLimit,
    minGuests,
    groupReservationLimit,
    maxTables,
    minDaysPrior,
    openingHours,
    closingHours,
  } = req.body;

  if (!validator.isInt(eventReservationLimit?.toString(), { min: 1 })) {
    errors.push({
      field: "eventReservationLimit",
      message: "Event reservation limit must be a positive number.",
    });
  }

  if (!validator.isInt(minGuests?.toString(), { min: 1 })) {
    errors.push({
      field: "minGuests",
      message: "Minimum guests must be at least 1.",
    });
  }

  if (!validator.isInt(groupReservationLimit?.toString(), { min: 1 })) {
    errors.push({
      field: "groupReservationLimit",
      message: "Group reservation limit must be a positive number.",
    });
  }

  if (!validator.isInt(maxTables?.toString(), { min: 1 })) {
    errors.push({
      field: "maxTables",
      message: "Maximum tables must be a positive number.",
    });
  }

  if (!validator.isInt(minDaysPrior?.toString(), { min: 0 })) {
    errors.push({
      field: "minDaysPrior",
      message: "Minimum days prior must be 0 or more.",
    });
  }

  if (!validator.isLength(openingHours?.toString(), { min: 1 })) {
    errors.push({
      field: "openingHours",
      message: "Opening hours are required.",
    });
  }

  if (!validator.isLength(closingHours?.toString(), { min: 1 })) {
    errors.push({
      field: "closingHours",
      message: "Closing hours are required.",
    });
  }

  if (errors.length > 0) {
    res.status(400).json({ success: false, errors });
    return;
  }

  next();
};
