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
    eventMinDaysPrior,
    eventFee,
    eventMinGuests,
    groupReservationLimit,
    groupMinDaysPrior,
    groupMaxTables,
    groupAvailableTables,
    openingHours,
    closingHours,
  } = req.body;

  // Validate eventReservationLimit: must be an integer ≥ 1
  if (!validator.isInt(eventReservationLimit?.toString(), { min: 1 })) {
    errors.push({
      field: "eventReservationLimit",
      message: "Event reservation limit must be a positive number.",
    });
  }

  // Validate eventMinDaysPrior: must be an integer ≥ 0
  if (!validator.isInt(eventMinDaysPrior?.toString(), { min: 0 })) {
    errors.push({
      field: "eventMinDaysPrior",
      message: "Event minimum days prior must be 0 or more.",
    });
  }

  // Validate eventFee: must be a number (float allowed) ≥ 0
  if (!validator.isFloat(eventFee?.toString(), { min: 0 })) {
    errors.push({
      field: "eventFee",
      message: "Event fee must be a positive number.",
    });
  }

  // Validate eventMinGuests: must be an integer ≥ 1
  if (!validator.isInt(eventMinGuests?.toString(), { min: 1 })) {
    errors.push({
      field: "eventMinGuests",
      message: "Event minimum guests must be at least 1.",
    });
  }

  // Validate groupReservationLimit: must be an integer ≥ 1
  if (!validator.isInt(groupReservationLimit?.toString(), { min: 1 })) {
    errors.push({
      field: "groupReservationLimit",
      message: "Group reservation limit must be a positive number.",
    });
  }

  // Validate groupMinDaysPrior: must be an integer ≥ 0
  if (!validator.isInt(groupMinDaysPrior?.toString(), { min: 0 })) {
    errors.push({
      field: "groupMinDaysPrior",
      message: "Group minimum days prior must be 0 or more.",
    });
  }

  // Validate groupMaxTables: must be an integer ≥ 0
  if (!validator.isInt(groupMaxTables?.toString(), { min: 0 })) {
    errors.push({
      field: "groupMaxTables",
      message: "Group max tables must be 0 or more.",
    });
  }

  // Validate groupAvailableTables: must be an integer ≥ 0
  if (!validator.isInt(groupAvailableTables?.toString(), { min: 0 })) {
    errors.push({
      field: "groupAvailableTables",
      message: "Group available tables must be 0 or more.",
    });
  }

  // Validate openingHours: must be a nonempty string
  if (!validator.isLength(openingHours?.toString(), { min: 1 })) {
    errors.push({
      field: "openingHours",
      message: "Opening hours are required.",
    });
  }

  // Validate closingHours: must be a nonempty string
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
