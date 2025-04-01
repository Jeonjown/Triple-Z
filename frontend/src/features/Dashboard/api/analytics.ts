// src/api/analyticsApi.ts
import axios from "axios";

// Base URL from environment or fallback to localhost
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create an axios instance with the base URL and credentials
const api = axios.create({
  baseURL,
  withCredentials: true,
});

export interface ReservationTotals {
  eventCount: number;
  groupCount: number;
  combinedTotal: number;
}

/**
 * Fetch reservation totals from the analytics endpoint.
 */
export const fetchReservationTotals = async (
  timeRange?: string,
): Promise<ReservationTotals> => {
  try {
    const url = timeRange
      ? `/api/analytics/total-reservations?timeRange=${timeRange}`
      : `/api/analytics/total-reservations`;
    const response = await api.get(url);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw {
        statusCode: error.response?.status || 500,
        message:
          error.response?.data?.error ||
          "An error occurred while fetching reservation totals",
      };
    }
    throw { statusCode: 500, message: "An unexpected error occurred" };
  }
};

export interface ReservationStats {
  eventStats: {
    pending: number;
    notPaid: number;
    partiallyPaid: number;
  };
  groupStats: {
    pending: number;
    notPaid: number;
  };
}

/**
 * Fetch dynamic reservation stats from the backend.
 */
export const fetchReservationStats = async (): Promise<ReservationStats> => {
  try {
    const response = await api.get<ReservationStats>(
      "/api/analytics/reservation-stats",
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw {
        statusCode: error.response?.status || 500,
        message:
          error.response?.data?.error ||
          "An error occurred while fetching reservation stats",
      };
    }
    throw { statusCode: 500, message: "An unexpected error occurred" };
  }
};

// ----- New: Time Series Data API -----
export interface ReservationTimeSeries {
  date: string; // ISO date string
  events: number;
  groups: number;
}

/**
 * Fetch dynamic reservation time series data from the backend.
 *
 * What it is: A function to get reservation counts grouped by date.
 * Why it's important: It lets you plot trends over time.
 * When to use: In components that display charts/analytics.
 * How to use: Call fetchReservationTimeSeries(timeRange) and handle the promise.
 */
export const fetchReservationTimeSeries = async (
  timeRange?: string,
): Promise<ReservationTimeSeries[]> => {
  try {
    const url = timeRange
      ? `/api/analytics/reservations-timeseries?timeRange=${timeRange}`
      : `/api/analytics/reservations-timeseries`;
    const response = await api.get<ReservationTimeSeries[]>(url);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw {
        statusCode: error.response?.status || 500,
        message:
          error.response?.data?.error ||
          "An error occurred while fetching reservation time series data",
      };
    }
    throw { statusCode: 500, message: "An unexpected error occurred" };
  }
};

/**
 * Fetch total number of users
 */
export const fetchTotalUsers = async (): Promise<number> => {
  try {
    const response = await api.get<{ totalUsers: number }>(
      "/api/analytics/total-users",
    );
    return response.data.totalUsers;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw {
        statusCode: error.response?.status || 500,
        message:
          error.response?.data?.error ||
          "An error occurred while fetching total users",
      };
    }
    throw { statusCode: 500, message: "An unexpected error occurred" };
  }
};

// Response types
export interface MonthlyUserData {
  month: string;
  count: number;
}

/**
 * Fetch monthly user signups
 */
export const fetchMonthlyUsers = async (): Promise<MonthlyUserData[]> => {
  try {
    const response = await api.get<MonthlyUserData[]>(
      "/api/analytics/monthly-users",
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw {
        statusCode: error.response?.status || 500,
        message:
          error.response?.data?.error ||
          "An error occurred while fetching monthly users",
      };
    }
    throw { statusCode: 500, message: "An unexpected error occurred" };
  }
};
