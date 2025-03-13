import { useMemo } from "react";
import useGetEventReservations from "./useGetEventReservations";

const useCheckEventReservationConflict = (selectedDate: Date) => {
  const {
    data: eventReservations,
    isPending,
    isError,
  } = useGetEventReservations();

  const conflict = useMemo(() => {
    if (!eventReservations || !eventReservations.reservations) return false;
    // Normalize the selected date (remove time)
    const normalizedSelected = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
    );

    return eventReservations.reservations.some(
      (reservation: { date: string }) => {
        const reservationDate = new Date(reservation.date);
        const normalizedReservation = new Date(
          reservationDate.getFullYear(),
          reservationDate.getMonth(),
          reservationDate.getDate(),
        );
        return normalizedReservation.getTime() === normalizedSelected.getTime();
      },
    );
  }, [selectedDate, eventReservations]);

  return { conflict, isPending, isError };
};

export default useCheckEventReservationConflict;
