// src/hooks/useFetchReservationTimeSeries.ts
import { useQuery } from "@tanstack/react-query";
import {
  fetchReservationTimeSeries,
  ReservationTimeSeries,
} from "../api/analytics";
import { CustomError } from "types";

/**
 * Custom hook to fetch reservation time series data.
 *
 * What it is: A React hook that wraps the API call for time series data.
 * Why it's important: It abstracts the data fetching logic and handles loading/error states.
 * When to use: In components that display dynamic chart data.
 * How to use: Call the hook with a time range, e.g. useFetchReservationTimeSeries("90d").
 */
export const useFetchReservationTimeSeries = (timeRange: string) => {
  const { data, isLoading, isError, error } = useQuery<
    ReservationTimeSeries[],
    CustomError
  >({
    queryKey: ["analytics", "reservationTimeSeries", timeRange],
    queryFn: () => fetchReservationTimeSeries(timeRange),
    retry: 1,
  });

  return { data, isLoading, isError, error };
};
