import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type HourlyTimePickerProps = {
  value: string;
  onChange: (time: string) => void;
  id?: string; // optional id for accessibility
};

const HourlyTimePicker = ({ onChange, value, id }: HourlyTimePickerProps) => {
  const workingHours = [
    ...Array.from({ length: 12 }, (_, i) => `${i + 1}:00 AM`),
    ...Array.from({ length: 12 }, (_, i) => `${i + 1}:00 PM`),
  ];

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger
        id={id}
        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2"
      >
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
