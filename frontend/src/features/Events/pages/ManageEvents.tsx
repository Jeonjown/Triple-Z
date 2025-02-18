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
  CalendarYearView,
} from "@/components/ui/full-calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";

const handleClick = () => {
  console.log("click");
};

const ManageEvents = () => {
  return (
    <>
      <Calendar
        events={[
          {
            id: "1",
            start: new Date("2025-03-25T09:30:00Z"),
            end: new Date("2025-04-26T14:30:00Z"),
            title: "event A",
            color: "blue",
          },
          {
            id: "2",
            start: new Date("2025-03-25T09:30:00Z"),
            end: new Date("2025-04-26T14:30:00Z"),
            title: "event B",
            color: "blue",
          },
          {
            id: "3",
            start: new Date("2025-03-26T09:30:00Z"),
            end: new Date("2025-04-26T14:30:00Z"),
            title: "event X",
            color: "blue",
          },
          {
            id: "2",
            start: new Date("2025-02-25T09:30:00Z"),
            end: new Date("2025-03-27T14:30:00Z"),
            title: "event A",
            color: "blue",
          },
        ]}
        onEventClick={handleClick}
      >
        <div className="flex h-dvh flex-col py-6">
          <div className="mb-6 flex items-center gap-2 px-6">
            <CalendarViewTrigger
              className="aria-[current=true]:bg-accent"
              view="day"
            >
              Day
            </CalendarViewTrigger>
            <CalendarViewTrigger
              view="week"
              className="aria-[current=true]:bg-accent"
            >
              Week
            </CalendarViewTrigger>
            <CalendarViewTrigger
              view="month"
              className="aria-[current=true]:bg-accent"
            >
              Month
            </CalendarViewTrigger>
            <CalendarViewTrigger
              view="year"
              className="aria-[current=true]:bg-accent"
            >
              Year
            </CalendarViewTrigger>

            <span className="flex-1" />

            <CalendarCurrentDate />

            <CalendarPrevTrigger>
              <ChevronLeft size={20} />
              <span className="sr-only">Previous</span>
            </CalendarPrevTrigger>

            <CalendarTodayTrigger>Today</CalendarTodayTrigger>

            <CalendarNextTrigger>
              <ChevronRight size={20} />
              <span className="sr-only">Next</span>
            </CalendarNextTrigger>

            {/* <ModeToggle /> */}
          </div>

          <div className="relative flex-1 overflow-auto px-6">
            <CalendarDayView />
            <CalendarWeekView />
            <CalendarMonthView />
            <CalendarYearView />
          </div>
        </div>
      </Calendar>
    </>
  );
};

export default ManageEvents;
