import { Request, Response, NextFunction } from "express";
import { GroupReservation } from "../models/groupReservationModel";
import { EventSettings } from "../models/eventSettingsModel";
import { createError } from "../utils/createError";

interface CartItem {
  _id: string;
  title: string;
  quantity: number;
  totalPrice: number;
  image: string;
}

interface CreateGroupReservationBody {
  userId: string;
  fullName: string;
  contactNumber: string;
  partySize: number;
  date: string;
  startTime: string;
  endTime: string;
  cart: CartItem[];
  eventFee: number;
  subtotal: number;
  totalPayment: number;
}

export const getAvailableTables = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Expecting date in query string (e.g., ?date=2025-03-10)
    const dateStr = req.query.date as string;
    if (!dateStr) {
      return next(createError("Date is required", 400));
    }

    // Set up start and end of day boundaries
    const reservationDate = new Date(dateStr);
    const startOfDay = new Date(reservationDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(reservationDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Retrieve event settings to get the total available group tables
    const settings = await EventSettings.findOne({}).exec();
    if (!settings) {
      return next(createError("Event settings not configured", 500));
    }
    if (settings.groupAvailableTables == null) {
      return next(createError("Group available tables not configured", 500));
    }
    const totalAvailableTables: number = settings.groupAvailableTables;

    // Aggregate group reservations for the day.
    const reservationsAggregate = await GroupReservation.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $project: {
          // Calculate number of tables required per reservation.
          tables: { $ceil: { $divide: ["$partySize", 6] } },
        },
      },
      {
        $group: {
          _id: null,
          totalReservedTables: { $sum: "$tables" },
        },
      },
    ]);

    const totalReservedTables: number =
      reservationsAggregate.length > 0
        ? (reservationsAggregate[0].totalReservedTables as number)
        : 0;

    // Calculate remaining tables
    const remainingTables: number = totalAvailableTables - totalReservedTables;

    res.status(200).json({ availableTables: remainingTables });
  } catch (error: unknown) {
    console.error("Error fetching available tables:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return next(createError(`Internal Server Error: ${errorMessage}`, 500));
  }
};

export const createGroupReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      userId,
      fullName,
      contactNumber,
      partySize,
      date,
      startTime,
      endTime,
      cart,
      eventFee,
      subtotal,
      totalPayment,
    } = req.body as CreateGroupReservationBody;

    // Validate required fields
    if (
      !userId ||
      !fullName ||
      !contactNumber ||
      !partySize ||
      !date ||
      !startTime ||
      !endTime
    ) {
      return next(createError("Missing required fields", 400));
    }

    // Calculate tables required (each table seats 6 guests)
    const tablesRequired: number = Math.ceil(partySize / 6);

    // Create day boundaries based on the reservation date
    const reservationDate = new Date(date);
    const startOfDay = new Date(reservationDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(reservationDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Retrieve event settings to get the total available tables
    const settings = await EventSettings.findOne({}).exec();
    if (!settings) {
      return next(createError("Event settings not configured", 500));
    }
    if (settings.groupAvailableTables == null) {
      return next(createError("Group available tables not configured", 500));
    }
    const totalAvailableTables: number = settings.groupAvailableTables;

    // Aggregate current reservations for the day to calculate reserved tables
    const reservationsAggregate = await GroupReservation.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $project: {
          tables: { $ceil: { $divide: ["$partySize", 6] } },
        },
      },
      {
        $group: {
          _id: null,
          totalReservedTables: { $sum: "$tables" },
        },
      },
    ]);

    const totalReservedTables: number =
      reservationsAggregate.length > 0
        ? (reservationsAggregate[0].totalReservedTables as number)
        : 0;

    const remainingTables: number = totalAvailableTables - totalReservedTables;

    // Check if there are enough available tables for the requested reservation
    if (remainingTables < tablesRequired) {
      return next(
        createError("Not enough available tables for the selected date", 400)
      );
    }

    // Create a new group reservation document
    const newReservation = new GroupReservation({
      userId,
      fullName,
      contactNumber,
      partySize,
      date: reservationDate,
      startTime,
      endTime,
      cart,
      eventFee,
      subtotal,
      totalPayment,
    });

    await newReservation.save();

    res.status(201).json({
      message: "Reservation created successfully",
      reservation: newReservation,
    });
  } catch (error: unknown) {
    console.error("Error creating group reservation:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return next(createError(`Internal Server Error: ${errorMessage}`, 500));
  }
};
