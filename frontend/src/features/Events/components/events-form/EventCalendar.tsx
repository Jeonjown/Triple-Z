import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import useGetEventReservations from "../../hooks/useGetEventReservations";
import { useGetEventReservationSettings } from "../../hooks/useGetEventReservationSettings";
import { useGetUnavailableDates } from "../../hooks/useGetUnavailableDates"; // Hook for unavailable dates
import useRemainingReservations from "../../hooks/useRemainingReservations"; // Hook to compute remaining slots
import LoadingPage from "@/pages/LoadingPage";
import { useFormContext } from "react-hook-form";
import { EventFormValues } from "../../pages/EventForm";

// Helper: normalize a date string to a Date at midnight
const normalizeDate = (dateStr: string): Date =>
  new Date(dateStr.split("T")[0]);

const EventCalendar: React.FC = () => {
  // Fetch data via custom hooks
  const { data, isPending, isError } = useGetEventReservations();
  const { data: settings } = useGetEventReservationSettings();
  const { data: unavailableDatesData } = useGetUnavailableDates();
  const { setValue, trigger } = useFormContext<EventFormValues>();

  // Local state for selected date and displayed month
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [displayedMonth, setDisplayedMonth] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // State for reserved and unavailable dates
  const [reservedDates, setReservedDates] = useState<Date[]>([]);
  const [unavailable, setUnavailable] = useState<Date[]>([]);

  // Update reserved dates—ignore reservations with eventStatus "Cancelled"
  useEffect(() => {
    if (data && data.reservations) {
      const dates: Date[] = data.reservations
        .filter(
          (reservation: { date: string; eventStatus: string }) =>
            reservation.eventStatus !== "Cancelled",
        )
        .map((reservation: { date: string }) =>
          normalizeDate(reservation.date),
        );
      setReservedDates(dates);
    }
  }, [data]);

  // Update unavailable dates from fetched data
  useEffect(() => {
    if (unavailableDatesData) {
      const dates: Date[] = unavailableDatesData.map(
        (item: { date: string }) => {
          const d = new Date(item.date);
          return new Date(d.getFullYear(), d.getMonth(), d.getDate());
        },
      );
      setUnavailable(dates);
    }
  }, [unavailableDatesData]);

  // Calculate earliest available booking date based on settings
  const earliestAvailableDate =
    settings?.eventMinDaysPrior !== undefined
      ? (() => {
          const d = new Date();
          d.setDate(d.getDate() + Number(settings.eventMinDaysPrior));
          return d;
        })()
      : null;

  const currentMonthName = displayedMonth.toLocaleString("default", {
    month: "long",
  });

  // Compute remaining reservations
  const remainingReservations = useRemainingReservations(displayedMonth);

  // Handle date selection—ignore if the date is booked or unavailable
  const handleSelect = (newDate?: Date): void => {
    if (!newDate) return;
    const normalizedNew = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate(),
    );
    const conflictReserved = reservedDates.some(
      (d) => d.getTime() === normalizedNew.getTime(),
    );
    const conflictUnavailable = unavailable.some(
      (d) => d.getTime() === normalizedNew.getTime(),
    );
    if (conflictReserved || conflictUnavailable) return;

    setSelectedDate(newDate);
    const localDate = new Date(
      newDate.getTime() - newDate.getTimezoneOffset() * 60000,
    );
    const formatted = localDate.toISOString().split("T")[0];
    setValue("date", formatted);
    trigger("date");
  };

  // Update displayed month when calendar's month changes (set to first day)
  const handleMonthChange = (newMonth: Date): void => {
    setDisplayedMonth(new Date(newMonth.getFullYear(), newMonth.getMonth(), 1));
  };

  if (isPending) return <LoadingPage />;
  if (isError)
    return <p className="text-center text-red-500">Error occurred!</p>;

  return (
    <div className="mx-auto mt-5 w-full max-w-4xl px-4">
      <div className="rounded-lg bg-white p-4">
        <h2 className="mb-2 text-center text-2xl font-bold text-primary">
          Event Reservation View
        </h2>
        <div className="mb-4 border p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            onMonthChange={handleMonthChange}
            className="mx-auto hover:cursor-pointer"
            modifiers={{
              booked: reservedDates,
              unavailable: unavailable,
            }}
            modifiersClassNames={{
              booked: "bg-primary text-white",
              unavailable: "bg-gray-500 text-white",
            }}
            disabled={[...reservedDates, ...unavailable]}
          />
          {/* Calendar legend */}
          <div className="mx-5 mb-5 flex justify-center space-x-4">
            <div className="flex items-center space-x-1">
              <p className="text-xs text-gray-600">Today:</p>
              <div className="h-4 w-4 rounded border bg-muted"></div>
            </div>
            <div className="flex items-center space-x-1">
              <p className="text-xs text-gray-600">Booked:</p>
              <div className="h-4 w-4 rounded bg-primary text-white opacity-60"></div>
            </div>
            <div className="flex items-center space-x-1">
              <p className="text-xs text-gray-600">Unavailable:</p>
              <div className="h-4 w-4 rounded bg-gray-500 text-white opacity-60"></div>
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
            <p className="text-xs font-semibold">Booking Period Begins:</p>
            <p className="font-semibold text-primary">
              {earliestAvailableDate
                ? earliestAvailableDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Loading..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;
