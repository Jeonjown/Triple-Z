import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  forwardRef,
} from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInMinutes,
  format,
  getMonth,
  isSameDay,
  isSameHour,
  isToday,
  setHours,
  setMonth,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import type { Locale } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { useHotkeys } from "react-hotkeys-hook";
import { User } from "lucide-react";

// ----- Styling Variants -----
const monthEventVariants = cva("size-2 rounded-full", {
  variants: {
    variant: {
      default: "bg-primary",
      blue: "bg-blue-500",
      green: "bg-green-500",
      pink: "bg-pink-500",
      purple: "bg-purple-500",
    },
  },
  defaultVariants: { variant: "default" },
});

const dayEventVariants = cva("font-bold border-l-4 rounded p-2 text-xs", {
  variants: {
    variant: {
      default: "bg-muted/30 text-muted-foreground border-muted",
      blue: "bg-blue-500/30 text-blue-600 border-blue-500",
      green: "bg-green-500/30 text-green-600 border-green-500",
      pink: "bg-pink-500/30 text-pink-600 border-pink-500",
      purple: "bg-purple-500/30 text-purple-600 border-purple-500",
    },
  },
  defaultVariants: { variant: "default" },
});

// ----- Types -----
export type CalendarEvent = {
  id: string;
  start: Date;
  end: Date;
  title: string;
  color?: "blue" | "pink" | "default" | "green" | "purple" | null;
};

type View = "day" | "week" | "month" | "year";

type CalendarContextType = {
  view: View;
  setView: (view: View) => void;
  date: Date;
  setDate: (date: Date) => void;
  events: CalendarEvent[];
  locale: Locale;
  setEvents: (events: CalendarEvent[]) => void;
  onChangeView?: (view: View) => void;
  onEventClick?: (event: CalendarEvent) => void;
  enableHotkeys?: boolean;
  today: Date;
};

const CalendarContext = createContext<CalendarContextType>(
  {} as CalendarContextType,
);

type CalendarProps = {
  children: ReactNode;
  defaultDate?: Date;
  events?: CalendarEvent[];
  view?: View;
  locale?: Locale;
  enableHotkeys?: boolean;
  onChangeView?: (view: View) => void;
  onEventClick?: (event: CalendarEvent) => void;
};

export const Calendar = ({
  children,
  defaultDate = new Date(),
  locale = enUS,
  enableHotkeys = true,
  view: _defaultView = "month",
  onEventClick,
  events: defaultEvents = [],
  onChangeView,
}: CalendarProps) => {
  const [view, setView] = useState<View>(_defaultView);
  const [date, setDate] = useState(defaultDate);
  const [events, setEvents] = useState<CalendarEvent[]>(defaultEvents);

  // Update events state if defaultEvents prop changes.
  useEffect(() => {
    setEvents(defaultEvents);
  }, [defaultEvents]);

  const changeView = (view: View) => {
    setView(view);
    onChangeView?.(view);
  };

  // Hotkeys configuration.
  useHotkeys("m", () => changeView("month"), { enabled: enableHotkeys });
  useHotkeys("w", () => changeView("week"), { enabled: enableHotkeys });
  useHotkeys("y", () => changeView("year"), { enabled: enableHotkeys });
  useHotkeys("d", () => changeView("day"), { enabled: enableHotkeys });

  return (
    <CalendarContext.Provider
      value={{
        view,
        setView,
        date,
        setDate,
        events,
        setEvents,
        locale,
        enableHotkeys,
        onEventClick,
        onChangeView,
        today: new Date(),
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => useContext(CalendarContext);

// ----- CalendarViewTrigger Component -----
export const CalendarViewTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & { view: View }
>(({ children, view, ...props }, ref) => {
  const { view: currentView, setView, onChangeView } = useCalendar();
  return (
    <Button
      ref={ref}
      aria-current={currentView === view}
      size="sm"
      variant="ghost"
      {...props}
      onClick={() => {
        setView(view);
        onChangeView?.(view);
      }}
    >
      {children}
    </Button>
  );
});
CalendarViewTrigger.displayName = "CalendarViewTrigger";

// ----- TimeTable Component -----
const TimeTable = () => {
  const now = new Date();
  return (
    <div className="w-12 pr-2">
      {Array.from({ length: 25 }).map((_, hour) => (
        <div
          key={hour}
          className="relative h-20 text-right text-xs text-muted-foreground/50 last:h-0"
        >
          {now.getHours() === hour && (
            <div
              className="z-absolute left-full h-[2px] w-dvw translate-x-2 bg-red-500"
              style={{ top: `${(now.getMinutes() / 60) * 100}%` }}
            >
              <div className="absolute left-0 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500" />
            </div>
          )}
          <p className="top-0 -translate-y-1/2">{hour === 24 ? 0 : hour}:00</p>
        </div>
      ))}
    </div>
  );
};

// ----- Helper Functions -----
const getDaysInMonth = (date: Date): Date[] => {
  const startOfMonthDate = startOfMonth(date);
  const startOfWeekForMonth = startOfWeek(startOfMonthDate, {
    weekStartsOn: 0,
  });
  let currentDate = startOfWeekForMonth;
  const calendar: Date[] = [];
  while (calendar.length < 42) {
    calendar.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  return calendar;
};

const generateWeekdays = (locale: Locale): string[] => {
  const start = startOfWeek(new Date(), { weekStartsOn: 0 });
  return Array.from({ length: 7 }, (_, i) =>
    format(addDays(start, i), "EEEEEE", { locale }),
  );
};

// ----- EventGroup Component (for Day & Week Views) -----
// Now renders a User icon and the reservation's full name.
const EventGroup = ({
  events,
  hour,
}: {
  events: CalendarEvent[];
  hour: Date;
}) => {
  const { onEventClick } = useCalendar();
  return (
    <div className="h-20 border-t last:border-b">
      {events
        .filter((event) => isSameHour(event.start, hour))
        .map((event) => {
          const hoursDifference =
            differenceInMinutes(event.end, event.start) / 60;
          const startPosition = event.start.getMinutes() / 60;
          return (
            <div
              key={event.id}
              className={cn(
                "relative flex cursor-pointer items-center gap-1",
                dayEventVariants({ variant: event.color ?? "default" }),
              )}
              style={{
                top: `${startPosition * 100}%`,
                height: `${hoursDifference * 100}%`,
              }}
              onClick={() => onEventClick && onEventClick(event)}
            >
              <User className="h-4 w-4" />
              <span className="truncate">
                {(event as any).details?.fullName || event.title}
              </span>
            </div>
          );
        })}
    </div>
  );
};

// ----- Calendar Views -----
export const CalendarDayView = () => {
  const { view, events, date } = useCalendar();
  if (view !== "day") return null;
  const hours = [...Array(24)].map((_, i) => setHours(date, i));
  return (
    <div className="relative flex h-full overflow-auto pt-2">
      <TimeTable />
      <div className="flex-1">
        {hours.map((hour) => (
          <EventGroup key={hour.toString()} hour={hour} events={events} />
        ))}
      </div>
    </div>
  );
};

export const CalendarWeekView = () => {
  const { view, date, locale, events } = useCalendar();
  const weekDates = useMemo(() => {
    const start = startOfWeek(date, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) =>
      [...Array(24)].map((_, j) => setHours(addDays(start, i), j)),
    );
  }, [date]);
  const headerDays = useMemo(() => {
    const start = startOfWeek(date, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [date]);
  if (view !== "week") return null;
  return (
    <div className="relative flex h-full flex-col overflow-auto">
      <div className="sticky top-0 z-10 mb-3 flex border-b bg-card">
        <div className="w-12"></div>
        {headerDays.map((d, i) => (
          <div
            key={d.toString()}
            className={cn(
              "flex flex-1 items-center justify-center gap-1 pb-2 text-center text-sm text-muted-foreground",
              [0, 6].includes(i) && "text-muted-foreground/50",
            )}
          >
            {format(d, "E", { locale })}
            <span
              className={cn(
                "grid h-6 place-content-center",
                isToday(d) &&
                  "size-6 rounded-full bg-primary text-primary-foreground",
              )}
            >
              {format(d, "d")}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-1">
        <div className="w-fit">
          <TimeTable />
        </div>
        <div className="grid flex-1 grid-cols-7">
          {weekDates.map((hours, i) => (
            <div
              key={hours[0].toString()}
              className={cn(
                "h-full border-l text-sm text-muted-foreground first:border-l-0",
                [0, 6].includes(i) && "bg-muted/50",
              )}
            >
              {hours.map((hour) => (
                <EventGroup key={hour.toString()} hour={hour} events={events} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CalendarMonthView = () => {
  const { date, view, events, locale, onEventClick } = useCalendar();
  const monthDates = useMemo(() => getDaysInMonth(date), [date]);
  const weekDays = useMemo(() => generateWeekdays(locale), [locale]);
  if (view !== "month") return null;
  return (
    <div className="flex h-full flex-col p-4">
      <div className="sticky top-0 mb-4 grid grid-cols-7 gap-2 pb-2">
        {weekDays.map((day, i) => (
          <div
            key={day}
            className={cn(
              "text-center text-sm font-medium text-gray-600",
              [0, 6].includes(i) && "text-gray-400",
            )}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="border-1 grid flex-1 grid-cols-7">
        {monthDates.map((_date) => {
          const currentEvents = events.filter((event) =>
            isSameDay(event.start, _date),
          );
          return (
            <div
              key={_date.toString()}
              className={cn(
                "flex flex-col border bg-white p-2 shadow-sm",
                "h-36",
              )}
            >
              <div className="flex justify-end">
                <span
                  className={cn(
                    "text-xs font-bold",
                    isToday(_date)
                      ? "rounded-full bg-primary p-1 text-white"
                      : "text-gray-500",
                  )}
                >
                  {format(_date, "d")}
                </span>
              </div>
              <div className="mt-1 flex-1 overflow-auto">
                {currentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex cursor-pointer items-center gap-1 rounded bg-gray-100 px-1 text-xs"
                    onClick={() => onEventClick && onEventClick(event)}
                  >
                    <User className="h-4 w-4" />
                    <span className="truncate">{event.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CalendarYearView = () => {
  const { view, date, today, locale } = useCalendar();
  const months = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) =>
      getDaysInMonth(setMonth(date, i)),
    );
  }, [date]);
  const weekDays = useMemo(() => generateWeekdays(locale), [locale]);
  if (view !== "year") return null;
  return (
    <div className="grid h-full grid-cols-4 gap-10 overflow-auto">
      {months.map((days, i) => (
        <div key={days[0].toString()}>
          <span className="text-xl">{i + 1}</span>
          <div className="my-5 grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-x-2 text-center text-xs tabular-nums">
            {days.map((_date) => (
              <div
                key={_date.toString()}
                className={cn(getMonth(_date) !== i && "text-muted-foreground")}
              >
                <div
                  className={cn(
                    "grid aspect-square size-full place-content-center tabular-nums",
                    isSameDay(today, _date) &&
                      getMonth(_date) === i &&
                      "rounded-full bg-primary text-primary-foreground",
                  )}
                >
                  {format(_date, "d")}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ----- Navigation Triggers -----
export const CalendarNextTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { date, setDate, view, enableHotkeys } = useCalendar();
  const next = useCallback(() => {
    if (view === "day") setDate(addDays(date, 1));
    else if (view === "week") setDate(addWeeks(date, 1));
    else if (view === "month") setDate(addMonths(date, 1));
    else if (view === "year") setDate(addYears(date, 1));
  }, [date, view, setDate]);
  useHotkeys("ArrowRight", () => next(), { enabled: enableHotkeys });
  return (
    <Button
      ref={ref}
      size="icon"
      variant="outline"
      {...props}
      onClick={(e) => {
        next();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
});
CalendarNextTrigger.displayName = "CalendarNextTrigger";

export const CalendarPrevTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { date, setDate, view, enableHotkeys } = useCalendar();
  const prev = useCallback(() => {
    if (view === "day") setDate(subDays(date, 1));
    else if (view === "week") setDate(subWeeks(date, 1));
    else if (view === "month") setDate(subMonths(date, 1));
    else if (view === "year") setDate(subYears(date, 1));
  }, [date, view, setDate]);
  useHotkeys("ArrowLeft", () => prev(), { enabled: enableHotkeys });
  return (
    <Button
      ref={ref}
      size="icon"
      variant="outline"
      {...props}
      onClick={(e) => {
        prev();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
});
CalendarPrevTrigger.displayName = "CalendarPrevTrigger";

export const CalendarTodayTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { setDate, enableHotkeys, today } = useCalendar();
  const jumpToToday = useCallback(() => setDate(today), [today, setDate]);
  useHotkeys("t", () => jumpToToday(), { enabled: enableHotkeys });
  return (
    <Button
      ref={ref}
      variant="outline"
      {...props}
      onClick={(e) => {
        jumpToToday();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
});
CalendarTodayTrigger.displayName = "CalendarTodayTrigger";

export const CalendarCurrentDate = () => {
  const { date, view } = useCalendar();
  return (
    <time dateTime={date.toISOString()} className="tabular-nums">
      {format(date, view === "day" ? "dd MMMM yyyy" : "MMMM yyyy")}
    </time>
  );
};
