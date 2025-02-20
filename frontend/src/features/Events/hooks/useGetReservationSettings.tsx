import { useQuery } from "@tanstack/react-query";
import {
  EventReservationSettings,
  getEventReservationSettings,
} from "../api/event";

export const useGetReservationSettings = () => {
  const { data, isPending, isError } = useQuery<EventReservationSettings>({
    queryKey: ["reservationSettings"],
    queryFn: getEventReservationSettings,
    retry: 2, // Retry twice on failure
  });

  return { data, isPending, isError };
};
