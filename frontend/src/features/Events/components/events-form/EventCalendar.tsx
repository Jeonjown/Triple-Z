import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import useRemainingReservations from "../../hooks/useRemainingReservations";
import { useGetEventReservationSettings } from "../../hooks/useGetEventReservationSettings";
import useGetEventReservations from "../../hooks/useGetEventReservations";
import LoadingPage from "@/pages/LoadingPage";

const EventCalendar = () => {
  const { data, isPending, isError } = useGetEventReservations();
  const { data: settings } = useGetEventReservationSettings();

  // Track the currently displayed month (set to the 1st of current month)
  const [displayedMonth, setDisplayedMonth] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Compute the displayed month name
  const currentMonthName = displayedMonth.toLocaleString("default", {
    month: "long",
  });

  // Calculate earliest available booking date based on settings
  const earliestAvailableDate =
    settings?.eventMinDaysPrior !== undefined
      ? (() => {
          const d = new Date();
          d.setDate(d.getDate() + Number(settings.eventMinDaysPrior));
          return d;
        })()
      : null;

  const [reservedDates, setReservedDates] = useState<Date[]>([]);
  const handleSelect = (newSelected: Date[] | undefined) => {
    setReservedDates(newSelected || []);
  };

  // Update reservedDates when reservation data changes
  useEffect(() => {
    if (data && data.reservations) {
      const dates = data.reservations.map(
        (reservation: { date: string }) => new Date(reservation.date),
      );
      setReservedDates(dates);
    }
  }, [data]);

  // Update displayed month when calendar's month changes
  const handleMonthChange = (newMonth: Date) => {
    // newMonth should be normalized to the first day of that month
    setDisplayedMonth(newMonth);
  };

  // Use the custom hook to calculate remaining slots for the displayed month
  const remainingReservations = useRemainingReservations(displayedMonth);

  if (isPending) return <LoadingPage />;
  if (isError)
    return <p className="text-center text-red-500">Error occurred!</p>;

  return (
    <div className="mx-auto mt-5 w-full max-w-4xl px-4">
      <div className="rounded-lg bg-white">
        <h2 className="mb-2 text-center text-2xl font-bold text-primary">
          Event Reservation View
        </h2>
        <div className="mb-4 border">
          <Calendar
            mode="multiple"
            selected={reservedDates}
            onSelect={handleSelect}
            onMonthChange={handleMonthChange} // Trigger month changes here
            className="mx-auto hover:cursor-not-allowed"
            disabled={true}
          />
          <div className="mx-5 mb-5 flex justify-center space-x-4">
            <div className="flex space-x-1">
              <p className="text-xs text-gray-600">Today:</p>
              <div className="h-4 w-4 rounded border bg-muted"></div>
            </div>
            <div className="flex space-x-1">
              <p className="text-xs text-gray-600">Booked:</p>
              <div className="h-4 w-4 rounded bg-primary"></div>
            </div>
          </div>
        </div>
        <div className="mb-6 flex justify-between px-2">
          <div className="flex flex-col items-center">
            <p className="text-xs font-semibold">
              Slots Left in {currentMonthName}
            </p>
            <p className="text-3xl font-extrabold text-primary">
              {remainingReservations}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-xs font-semibold">Earliest Booking Date</p>
            <p className="text-xs">prior the event</p>
            <p className="font-semibold text-primary">
              {earliestAvailableDate
                ? earliestAvailableDate.toLocaleDateString()
                : "Loading..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;
