import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import useGetGroupReservations from "../../hooks/useGetGroupReservations";
import { useGetEventReservationSettings } from "../../hooks/useGetEventReservationSettings";
import LoadingPage from "@/pages/LoadingPage";

const GroupCalendar: React.FC = () => {
  const { data, isPending, isError } = useGetGroupReservations();
  const { data: settings } = useGetEventReservationSettings();
  const [reservedDates, setReservedDates] = useState<Date[]>([]);
  const [fullDates, setFullDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableTables, setAvailableTables] = useState<number | null>(null);

  const handleSelect = (day: Date | undefined) => {
    setSelectedDate(day);
    if (day && data && settings) {
      // Define start and end of the day.
      const startOfDay = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
      );
      const endOfDay = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate() + 1,
      );

      // Filter reservations for the day.
      const reservationsForDay = data.filter(
        (reservation: { date: string; partySize: number }) => {
          const resDate = new Date(reservation.date);
          return resDate >= startOfDay && resDate < endOfDay;
        },
      );

      // Sum tables required by all reservations.
      const totalBookedTables = reservationsForDay.reduce(
        (sum, reservation) => {
          return (
            sum +
            Math.ceil(reservation.partySize / settings.groupMaxGuestsPerTable)
          );
        },
        0,
      );

      // Calculate available tables ignoring the current party's requirement.
      const available = settings.groupMaxTablesPerDay - totalBookedTables;
      setAvailableTables(available);
      // Note: We do not propagate this value to disable the next button.
    } else {
      setAvailableTables(null);
    }
  };

  // Set reserved dates for styling.
  useEffect(() => {
    if (data) {
      const dates = data.map((reservation: { date: string }) => {
        const d = new Date(reservation.date);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      });
      setReservedDates(dates);
    }
  }, [data]);

  // Compute fully booked dates for styling.
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
            modifiers={{ reserved: reservedDates, full: fullDates }}
            modifiersStyles={{
              reserved: { backgroundColor: "#7b4d35", color: "white" },
              full: { backgroundColor: "#e11d48", color: "white" },
            }}
            modifiersClassNames={{ reserved: "reserved-day", full: "full-day" }}
            className="mx-auto hover:cursor-pointer"
            disabled={false}
          />
          {/* Legend */}
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
      <style>{`
        .reserved-day:hover,
        .full-day:hover {
          opacity: 0.75;
        }
      `}</style>
    </div>
  );
};

export default GroupCalendar;
