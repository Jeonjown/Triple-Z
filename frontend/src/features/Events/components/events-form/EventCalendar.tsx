import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import useRemainingReservations from "../../hooks/useRemainingReservations";

import useGetEventReservations from "../../hooks/useGetEventReservations";
import LoadingPage from "@/pages/LoadingPage";
import { useFormContext } from "react-hook-form";
import { EventFormValues } from "../../pages/EventForm";
import { useGetEventReservationSettings } from "../../hooks/useGetEventReservationSettings";

// Helper: normalize a date string to a Date at midnight
const normalizeDate = (dateStr: string) => new Date(dateStr.split("T")[0]);

const EventCalendar = () => {
  const { data, isPending, isError } = useGetEventReservations();
  const { data: settings } = useGetEventReservationSettings();
  const { setValue, trigger } = useFormContext<EventFormValues>();

  // Use undefined for selected date to satisfy DayPicker's type
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Track displayed month (normalized to the first day)
  const [displayedMonth, setDisplayedMonth] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

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

  // Reserved dates from the API (booked reservations), normalized to midnight
  const [reservedDates, setReservedDates] = useState<Date[]>([]);
  useEffect(() => {
    if (data && data.reservations) {
      const dates = data.reservations.map((reservation: { date: string }) =>
        normalizeDate(reservation.date),
      );
      setReservedDates(dates);
    }
  }, [data]);

  // When a date is clicked, update state and form field.
  // If the date is already booked, do nothing.
  const handleSelect = (newDate?: Date) => {
    if (!newDate) return;
    // Normalize newDate for comparison (set to midnight)
    const normalizedNew = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate(),
    );
    const conflictExists = reservedDates.some(
      (d) => d.getTime() === normalizedNew.getTime(),
    );
    if (conflictExists) {
      // If the date is booked, do nothing.
      return;
    }
    setSelectedDate(newDate);
    // Adjust for timezone offset so the formatted date is correct locally.
    const localDate = new Date(
      newDate.getTime() - newDate.getTimezoneOffset() * 60000,
    );
    const formatted = localDate.toISOString().split("T")[0];
    setValue("date", formatted);
    trigger("date");
  };

  // Update displayed month when calendar's month changes
  const handleMonthChange = (newMonth: Date) => {
    setDisplayedMonth(new Date(newMonth.getFullYear(), newMonth.getMonth(), 1));
  };

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
            mode="single" // Allow single date selection
            selected={selectedDate}
            onSelect={handleSelect}
            onMonthChange={handleMonthChange}
            className="mx-auto hover:cursor-pointer"
            // Use DayPicker modifiers to mark booked dates with a primary background
            modifiers={{ booked: reservedDates }}
            modifiersClassNames={{ booked: "bg-primary text-white" }}
            // Disable the booked dates so they are not clickable
            disabled={reservedDates}
          />
          <div className="mx-5 mb-5 flex justify-center space-x-4">
            <div className="flex space-x-1">
              <p className="text-xs text-gray-600">Today:</p>
              <div className="h-4 w-4 rounded border bg-muted"></div>
            </div>
            <div className="flex space-x-1">
              <p className="text-xs text-gray-600">Booked:</p>
              <div className="h-4 w-4 rounded bg-primary opacity-50"></div>
            </div>
            <div className="flex space-x-1">
              <p className="text-xs text-gray-600">Selected:</p>
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
