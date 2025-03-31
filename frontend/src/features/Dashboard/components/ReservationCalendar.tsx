import {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
} from "@/components/ui/full-calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ReservationCalendar = () => {
  return (
    <Calendar defaultDate={new Date()} events={[]}>
      <div className="space-y-4 p-4">
        {/* Navigation Controls */}
        <div className="mx-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarPrevTrigger>
              <ChevronLeft />
            </CalendarPrevTrigger>

            <CalendarNextTrigger>
              <ChevronRight />
            </CalendarNextTrigger>
            <CalendarTodayTrigger className="">Today</CalendarTodayTrigger>
          </div>
          <div className="ml-2 text-2xl font-semibold text-primary">
            <CalendarCurrentDate />
          </div>
          {/* View Switcher */}
          <div className="flex items-center justify-center space-x-2">
            <CalendarViewTrigger view="week" className="bg-primary text-white">
              Week
            </CalendarViewTrigger>
            <CalendarViewTrigger view="month" className="bg-primary text-white">
              Month
            </CalendarViewTrigger>
          </div>
        </div>

        {/* Calendar Views */}

        <div className="p-2">
          {/* Only the view matching the current mode will render */}
          <CalendarDayView />
          <CalendarWeekView />
          <CalendarMonthView />
        </div>
      </div>
    </Calendar>
  );
};

export default ReservationCalendar;
