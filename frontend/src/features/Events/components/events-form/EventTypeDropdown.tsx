// EventTypeDropdown.tsx
import { useState, ChangeEvent, FC } from "react";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

type EventTypeDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  commonEvents: string[];
  onOthersSelect?: () => void; // Optional callback when "Others" is selected
};

const EventTypeDropdown: FC<EventTypeDropdownProps> = ({
  value,
  onChange,
  commonEvents,
  onOthersSelect,
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.value);
    setShowDropdown(true);
  };

  const handleIconClick = (): void => {
    setShowDropdown((prev) => !prev);
  };

  const handleSelectEvent = (selected: string): void => {
    if (selected === "Others" && onOthersSelect) {
      // Clear the field and notify parent to switch to free input mode.
      onChange("");
      onOthersSelect();
    } else {
      onChange(selected);
    }
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <Input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder="Ex. Birthday, Party"
          className="w-full rounded border p-3 pr-10 focus:outline-secondary"
        />
        <button
          type="button"
          onClick={handleIconClick}
          className="absolute right-3"
          aria-label="Toggle dropdown"
        >
          <ChevronDown className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      {showDropdown && (
        <ul className="absolute z-10 mt-1 w-full rounded border bg-white shadow-md">
          {commonEvents.map((item) => (
            <li
              key={item}
              onClick={() => handleSelectEvent(item)}
              className="cursor-pointer p-2 hover:bg-gray-100"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventTypeDropdown;
