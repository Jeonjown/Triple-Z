import { useState } from "react";
import Calendar from "react-calendar";

// Use the Value type directly from react-calendar
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
  const [date, setDate] = useState<Value>(new Date());

  const handleOnChange = (newDate: Value) => {
    setDate(newDate);
  };

  return (
    <div className="mt-8 flex items-center justify-center">
      {/* Parent container to center content */}
      <div className="">
        {/* Calendar wrapper */}
        <p className="mb-2">Available Dates</p>
        <Calendar
          onChange={handleOnChange}
          value={date}
          locale="en-US"
          className="react-calendar rounded-lg border border-gray-300 px-8 py-10 font-body shadow-md"
        />
        <p className="mt-4 text-center">
          Selected Date(s): {date ? date.toString() : "None"}
        </p>
      </div>
    </div>
  );
};

export default EventCalendar;
