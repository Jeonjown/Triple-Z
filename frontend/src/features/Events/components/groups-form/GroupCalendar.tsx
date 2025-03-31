import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import useGetGroupReservations from "../../hooks/useGetGroupReservations";
import { useGetEventReservationSettings } from "../../hooks/useGetEventReservationSettings";
import LoadingPage from "@/pages/LoadingPage";
import { useFormContext } from "react-hook-form";
import { GroupFormValues } from "../../pages/GroupForm";
import { useGetUnavailableDates } from "../../hooks/useGetUnavailableDates";

const GroupCalendar: React.FC = () => {
  // Fetch reservations, settings, and unavailable dates using custom hooks
  const { data, isPending, isError } = useGetGroupReservations();
  const { data: settings } = useGetEventReservationSettings();
  const { data: unavailableDates } = useGetUnavailableDates();

  // Get setValue and trigger from react-hook-form
  const { setValue, trigger } = useFormContext<GroupFormValues>();

  // States for reserved, fully booked, and unavailable dates
  const [reservedDates, setReservedDates] = useState<Date[]>([]);
  const [fullDates, setFullDates] = useState<Date[]>([]);
  const [unavailable, setUnavailable] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableTables, setAvailableTables] = useState<number | null>(null);

  // Handle date selection: update local state, form, and compute available tables
  const handleSelect = (day: Date | undefined): void => {
    setSelectedDate(day);
    if (!day || !data || !settings) return;

    // Normalize date (date-only)
    const normalizedDay = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate(),
    );
    const localDate = new Date(
      normalizedDay.getTime() - normalizedDay.getTimezoneOffset() * 60000,
    );
    const formatted = localDate.toISOString().split("T")[0];
    setValue("date", formatted);
    trigger("date");

    // Calculate available tables for the selected day
    const startOfDay = normalizedDay;
    const endOfDay = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate() + 1,
    );
    const reservationsForDay = data.filter(
      (reservation: { date: string; partySize: number }) => {
        const resDate = new Date(reservation.date);
        return resDate >= startOfDay && resDate < endOfDay;
      },
    );
    const totalBookedTables = reservationsForDay.reduce(
      (sum: number, reservation: { date: string; partySize: number }) =>
        sum +
        Math.ceil(reservation.partySize / settings.groupMaxGuestsPerTable),
      0,
    );
    const available = settings.groupMaxTablesPerDay - totalBookedTables;
    setAvailableTables(available);
  };

  // Map reservations to reservedDates (date-only)
  useEffect(() => {
    if (data) {
      const dates = data.map((reservation: { date: string }) => {
        const d = new Date(reservation.date);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      });
      setReservedDates(dates);
    }
  }, [data]);

  // Compute fullDates based on reservations and settings
  useEffect(() => {
    if (data && settings) {
      const dateCountMap = new Map<string, number>();
      data.forEach((reservation: { date: string; partySize: number }) => {
        const d = new Date(reservation.date);
        const norm = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const key = norm.toISOString();
        const tables = Math.ceil(
          reservation.partySize / settings.groupMaxGuestsPerTable,
        );
        dateCountMap.set(key, (dateCountMap.get(key) || 0) + tables);
      });
      const full: Date[] = [];
      for (const [key, totalTables] of dateCountMap.entries()) {
        if (totalTables >= settings.groupMaxTablesPerDay) {
          full.push(new Date(key));
        }
      }
      setFullDates(full);
    }
  }, [data, settings]);

  // Map fetched unavailableDates to Date objects
  useEffect(() => {
    if (unavailableDates) {
      const dates: Date[] = unavailableDates.map((item: { date: string }) => {
        const d = new Date(item.date);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      });
      setUnavailable(dates);
    }
  }, [unavailableDates]);

  if (isPending || !settings) return <LoadingPage />;
  if (isError)
    return <p className="text-center text-red-500">Error occurred!</p>;

  return (
    <div className="mx-auto mt-5 w-full max-w-4xl px-4">
      <div className="rounded-lg bg-white">
        <h2 className="mb-2 text-center text-2xl font-bold text-primary">
          Group Reservation View
        </h2>
        <div className="mb-4 border p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            // Include reserved, full, and unavailable dates as modifiers
            modifiers={{
              reserved: reservedDates,
              full: fullDates,
              unavailable: unavailable,
            }}
            modifiersStyles={{
              reserved: { backgroundColor: "#7b4d35", color: "white" },
              full: { backgroundColor: "#e11d48", color: "white" },
              unavailable: { backgroundColor: "#6b7280", color: "white" },
            }}
            modifiersClassNames={{
              reserved: "reserved-day",
              full: "full-day",
              unavailable: "unavailable-day",
            }}
            // Disable selection on unavailable dates
            disabled={unavailable}
            className="mx-auto hover:cursor-pointer"
          />
          {/* Legend for Calendar Colors */}
          <div className="mx-5 mb-5 flex justify-center space-x-4">
            <div className="flex items-center space-x-1">
              <p className="text-xs text-gray-600">Today:</p>
              <div className="h-4 w-4 rounded bg-muted"></div>
            </div>
            <div className="flex items-center space-x-1">
              <p className="text-xs text-gray-600">Partially Booked:</p>
              <div className="h-4 w-4 rounded bg-primary"></div>
            </div>
            <div className="flex items-center space-x-1">
              <p className="text-xs text-gray-600">Fully Booked:</p>
              <div
                className="h-4 w-4 rounded"
                style={{ backgroundColor: "#e11d48" }}
              ></div>
            </div>
            <div className="flex items-center space-x-1">
              <p className="text-xs text-gray-600">Unavailable:</p>
              <div
                className="h-4 w-4 rounded"
                style={{ backgroundColor: "#6b7280" }}
              ></div>
            </div>
          </div>
          {selectedDate && availableTables !== null && (
            <div className="text-center">
              <p className="text-sm">
                Available tables on {selectedDate.toLocaleDateString()}:
              </p>
              <p className="text-lg font-bold">{availableTables}</p>
            </div>
          )}
        </div>
      </div>
      {/* Simple hover effect for calendar modifiers */}
      <style>{`
        .reserved-day:hover,
        .full-day:hover,
        .unavailable-day:hover {
          opacity: 0.75;
        }
      `}</style>
    </div>
  );
};

export default GroupCalendar;
