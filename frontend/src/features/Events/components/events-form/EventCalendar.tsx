import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import useGetEventReservations from "../../hooks/useGetEventReservations";

const EventCalendar = () => {
  const { data, isPending, isError } = useGetEventReservations();
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

      <div className="mx-auto mt-5">
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
        <div className="mt-2 flex justify-center">
          <div className="flex space-x-1">
            <p className="text-xs">Reserved Dates: </p>
            <div className="h-4 w-4 rounded bg-primary"></div>
          </div>
          <div className="flex space-x-2"></div>
        </div>
      </div>
    </>
  );
};

export default EventCalendar;
