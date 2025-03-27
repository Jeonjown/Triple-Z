// HourlyTimePicker.tsx
import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetEventReservationSettings } from "../../hooks/useGetEventReservationSettings";

type HourlyTimePickerProps = {
  value: string;
  onChange: (time: string) => void;
  // Flag indicating this picker is for start time so we can limit options.
  isStartTime?: boolean;
};

const HourlyTimePicker = ({
  onChange,
  value,
  isStartTime = false,
}: HourlyTimePickerProps) => {
  // Fetch settings including opening and closing hours.
  const { data: settings, isPending } = useGetEventReservationSettings();

  // Use fallback defaults if API data is missing.
  const openingHours = settings?.openingHours || "10:00 AM";
  const closingHours = settings?.closingHours || "8:00 PM";

  // Convert a "HH:MM AM/PM" string into minutes since midnight.
  const parseTimeString = (timeStr: string): number => {
    const [time, modifier] = timeStr.split(" ");
    const [hoursStr, minutesStr] = time.split(":");
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    if (modifier.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  // Format minutes since midnight back to a "h:MM AM/PM" string.
  const formatTime = (minutes: number): string => {
    // Adjust minutes to be within a 24-hour format for display.
    const normalizedMinutes = minutes % (24 * 60);
    let hours = Math.floor(normalizedMinutes / 60);
    const mins = normalizedMinutes % 60;
    const modifier = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${hours}:${mins.toString().padStart(2, "0")} ${modifier}`;
  };

  // Generate valid time slots, accounting for the possibility of overnight closing.
  const workingHours = useMemo(() => {
    const start = parseTimeString(openingHours);
    let end = parseTimeString(closingHours);
    // If closing time is less than or equal to opening time, assume it's the next day.
    if (end <= start) {
      end += 24 * 60;
    }
    // For start time picker, limit options so that the last slot is 2 hours before closing.
    const lastSlot = isStartTime ? end - 120 : end;
    const times: string[] = [];
    for (let time = start; time <= lastSlot; time += 60) {
      times.push(formatTime(time));
    }
    return times;
  }, [openingHours, closingHours, isStartTime]);

  if (isPending) return <p>Loading...</p>;

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-full rounded-md border border-gray-300 bg-white px-4 py-2">
        <SelectValue placeholder="Select time" />
      </SelectTrigger>
      <SelectContent className="w-full">
        {workingHours.map((hour, index) => (
          <SelectItem key={index} value={hour}>
            {hour}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default HourlyTimePicker;
