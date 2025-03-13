import { useMemo } from "react";
import useGetEventReservations from "./useGetEventReservations";
import { useGetEventReservationSettings } from "./useGetEventReservationSettings";

// This hook accepts a displayedMonth (a Date) and returns the number of remaining slots
const useRemainingReservations = (displayedMonth: Date): number => {
  const { data } = useGetEventReservations();
  const { data: settings } = useGetEventReservationSettings();

  const remainingReservations = useMemo(() => {
    if (!data || !data.reservations || !settings?.eventReservationLimit) {
      return 0;
    }
    const displayedYear = displayedMonth.getFullYear();
    const displayedMonthIndex = displayedMonth.getMonth();

    // Filter reservations that occur within the displayed month
    const reservationsThisMonth = data.reservations.filter(
      (reservation: { date: string }) => {
        const reservationDate = new Date(reservation.date);
        return (
          reservationDate.getFullYear() === displayedYear &&
          reservationDate.getMonth() === displayedMonthIndex
        );
      },
    );

    const remaining =
      settings.eventReservationLimit - reservationsThisMonth.length;
    return Math.max(0, remaining);
  }, [data, settings, displayedMonth]);

  return remainingReservations;
};

export default useRemainingReservations;
