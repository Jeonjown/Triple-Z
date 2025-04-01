// src/hooks/useFetchReservationTotals.ts
import { useQuery } from "@tanstack/react-query";

import { CustomError } from "types"; // adjust the import path if needed
import { fetchReservationTotals, ReservationTotals } from "../api/analytics";

export const useFetchReservationTotals = (timeRange?: string) => {
  const { data, isPending, isError, error } = useQuery<
    ReservationTotals,
    CustomError
  >({
    queryKey: ["analytics", "reservationTotals", timeRange],
    queryFn: () => fetchReservationTotals(timeRange),
    retry: 1,
  });

  return { data, isPending, isError, error };
};
