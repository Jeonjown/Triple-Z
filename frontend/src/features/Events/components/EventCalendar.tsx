import { useEffect, useState } from "react";
import useGetReservations from "../hooks/useGetReservations";
import { Calendar } from "@/components/ui/calendar";

const EventCalendar = () => {
  const { data, isPending, isError } = useGetReservations();
  const [reservedDates, setReservedDates] = useState<Date[] | undefined>([]);

  const handleSelect = (newSelected: Date[] | undefined) => {
    // Update the selected dates
    setReservedDates(newSelected);
  };

  // Update reservedDates when data changes
  useEffect(() => {
    if (data && data.reservations) {
      const dates = data.reservations.map(
        (reservation: { date: string }) => new Date(reservation.date),
      );
      setReservedDates(dates);
    }
  }, [data]);

  return (
    <>
      {isPending && <p>Loading...</p>}
      {isError && <p>Error occurred!</p>}

      <div className="mx-auto">
        <div className="text-center font-semibold text-primary">
          Reserved Dates
        </div>
        <Calendar
          mode="multiple"
          selected={reservedDates}
          onSelect={handleSelect}
          className="mx-auto flex justify-center rounded-md border"
          // Disable the calendar visually and prevent interaction
          disabled={true}
        />
      </div>
    </>
  );
};

export default EventCalendar;
