// controllers/analyticsController.ts
import { Request, Response } from "express";
import { EventReservation } from "../models/eventReservationModel";
import { GroupReservation } from "../models/groupReservationModel";
import User from "../models/userModel";

export const getReservationTotals = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Run both queries in parallel to improve performance
    const [eventCount, groupCount] = await Promise.all([
      EventReservation.countDocuments(), // Count all event reservations
      GroupReservation.countDocuments(), // Count all group reservations
    ]);

    res.json({
      eventCount,
      groupCount,
      combinedTotal: eventCount + groupCount,
    });
  } catch (error: any) {
    console.error("Error fetching reservation totals:", error);
    res.status(500).json({
      message: "Error fetching reservation totals",
      error: error.message,
    });
  }
};

/**
 * Controller to fetch reservation time series data.
 * Aggregates counts by date for both Event and Group reservations,
 * filtering by reservationType.
 */
export const getReservationTimeSeries = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const now = new Date();
    const timeRange: string = (req.query.timeRange as string) || "90d";
    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    if (timeRange === "7d") daysToSubtract = 7;

    const startDate = new Date();
    startDate.setDate(now.getDate() - daysToSubtract);

    // Aggregate Event Reservations by date, checking reservationType
    const eventsData = await EventReservation.aggregate([
      {
        $match: {
          reservationType: "Event", // Check for Event type
          date: { $gte: startDate }, // Optionally remove upper bound if needed
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Aggregate Group Reservations by date, checking reservationType
    const groupsData = await GroupReservation.aggregate([
      {
        $match: {
          reservationType: "Groups", // Check for Groups type
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Merge both aggregation results into one time series
    const timeSeriesMap: Record<string, { events: number; groups: number }> =
      {};

    eventsData.forEach((item) => {
      timeSeriesMap[item._id] = { events: item.count, groups: 0 };
    });

    groupsData.forEach((item) => {
      if (timeSeriesMap[item._id]) {
        timeSeriesMap[item._id].groups = item.count;
      } else {
        timeSeriesMap[item._id] = { events: 0, groups: item.count };
      }
    });

    const timeSeries = Object.keys(timeSeriesMap)
      .sort()
      .map((date) => ({
        date,
        events: timeSeriesMap[date].events,
        groups: timeSeriesMap[date].groups,
      }));

    res.json(timeSeries);
  } catch (error: any) {
    console.error("Error fetching reservation time series:", error);
    res.status(500).json({
      message: "Error fetching reservation time series",
      error: error.message,
    });
  }
};

export const getReservationStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Count event reservations with different statuses
    const eventPending: number = await EventReservation.countDocuments({
      eventStatus: "Pending",
    });
    const eventNotPaid: number = await EventReservation.countDocuments({
      paymentStatus: "Not Paid",
    });
    const eventPartiallyPaid: number = await EventReservation.countDocuments({
      paymentStatus: "Partially Paid",
    });

    // Count group reservations with different statuses
    const groupPending: number = await GroupReservation.countDocuments({
      eventStatus: "Pending",
    });
    const groupNotPaid: number = await GroupReservation.countDocuments({
      paymentStatus: "Not Paid",
    });

    // Send the stats as JSON response
    res.json({
      eventStats: {
        pending: eventPending,
        notPaid: eventNotPaid,
        partiallyPaid: eventPartiallyPaid,
      },
      groupStats: {
        pending: groupPending,
        notPaid: groupNotPaid,
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching reservation stats:", error);
    res.status(500).json({
      message: "Error fetching reservation stats",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// 📌 Get total number of users
export const getTotalUsers = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json({ totalUsers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching total users", error });
  }
};

// 📌 Get monthly user signups
export const getMonthlyUsers = async (req: Request, res: Response) => {
  try {
    const usersPerMonth = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort by month
    ]);

    res.status(200).json(usersPerMonth);
  } catch (error) {
    res.status(500).json({ message: "Error fetching monthly users", error });
  }
};
