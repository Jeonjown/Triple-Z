// src/hooks/useFetchReservationStats.ts

import { useQuery } from "@tanstack/react-query";
import { CustomError } from "types";
import { ReservationStats, fetchReservationStats } from "../api/analytics";

export const useFetchReservationStats = () => {
  // Use React Query's useQuery to handle the API call.
  const { data, isPending, isError, error } = useQuery<
    ReservationStats,
    CustomError
  >({
    queryKey: ["analytics", "reservationStats"], // Unique key for the query
    queryFn: fetchReservationStats, // Function that fetches the stats
    retry: 1, // Retry once in case of an error
  });

  // Return the fetched data and query status flags
  return { data, isPending, isError, error };
};
