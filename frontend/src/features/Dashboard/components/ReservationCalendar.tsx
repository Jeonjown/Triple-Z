import { useMemo, useState } from "react";
import {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarWeekView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarEvent,
  useCalendar,
} from "@/components/ui/full-calendar";
import { useGetAllReservations } from "@/features/Events/hooks/useGetAllReservations";
import { useGetUnavailableDates } from "@/features/Events/hooks/useGetUnavailableDates";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import {
  format,
  parse,
  isSameDay,
  addDays,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useGetEventReservationSettings } from "@/features/Events/hooks/useGetEventReservationSettings";

// --- Types ---
interface CartItem {
  _id: string;
  title: string;
  quantity: number;
  price?: number;
  totalPrice: number;
  image: string;
  size: string;
}

interface IReservation {
  _id: string;
  userId: { _id: string; username: string; email: string };
  fullName: string;
  contactNumber: string;
  partySize: number;
  date: string;
  startTime: string;
  endTime: string;
  eventType?: string;
  eventStatus: string;
  paymentStatus: string;
  specialRequest?: string;
  reservationType: string;
  cart?: CartItem[];
  subtotal?: number;
  totalPayment?: number;
  eventFee?: number;
  isCorkage?: boolean;
}

interface ExtendedCalendarEvent extends CalendarEvent {
  details: IReservation;
}

// --- ReservationCalendar Component ---
const ReservationCalendar = () => {
  const { data: reservations } = useGetAllReservations();
  const { data: unavailableDates = [] } = useGetUnavailableDates();
  const { data: settings } = useGetEventReservationSettings();
  console.log(settings?.eventCorkageFee);
  console.log("Reservations:", reservations);
  console.log("Unavailable Dates:", unavailableDates);
  const [selectedReservation, setSelectedReservation] =
    useState<IReservation | null>(null);

  const calendarEvents: ExtendedCalendarEvent[] = useMemo(() => {
    if (!reservations || !reservations.reservations) return [];
    return (reservations.reservations as IReservation[]).map((res) => {
      const baseDate = format(new Date(res.date), "yyyy-MM-dd");
      const start = parse(
        `${baseDate} ${res.startTime}`,
        "yyyy-MM-dd h:mm a",
        new Date(),
      );
      const end = parse(
        `${baseDate} ${res.endTime}`,
        "yyyy-MM-dd h:mm a",
        new Date(),
      );
      const title = res.fullName;
      const color: "blue" | "pink" | "default" | "green" | "purple" =
        res.reservationType === "Event" ? "blue" : "pink";
      return { id: res._id, start, end, title, color, details: res };
    });
  }, [reservations]);

  const handleEventClick = (event: CalendarEvent): void => {
    setSelectedReservation((event as ExtendedCalendarEvent).details);
  };

  // --- Custom Month View that reflects Unavailable Dates ---
  const CalendarMonthViewWithUnavailableDates = () => {
    console.log(selectedReservation);
    const { date, onEventClick } = useCalendar();
    const startOfMonthDate = startOfMonth(date);
    const startOfWeekForMonth = startOfWeek(startOfMonthDate, {
      weekStartsOn: 0,
    });
    const monthDates = useMemo(() => {
      const dates: Date[] = [];
      let currentDate = startOfWeekForMonth;
      while (dates.length < 42) {
        dates.push(new Date(currentDate));
        currentDate = addDays(currentDate, 1);
      }
      return dates;
    }, [startOfWeekForMonth]);

    const weekDays = useMemo(() => {
      const start = startOfWeek(date, { weekStartsOn: 0 });
      return Array.from({ length: 7 }, (_, i) =>
        format(addDays(start, i), "EEEEEE"),
      );
    }, [date]);

    return (
      <div className="flex h-full flex-col p-4">
        {/* Weekdays Header */}
        <div className="sticky top-0 mb-4 grid grid-cols-7 gap-2 pb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-600"
            >
              {day}
            </div>
          ))}
        </div>
        {/* Calendar Grid */}
        <div className="grid flex-1 grid-cols-7 border">
          {monthDates.map((cellDate) => {
            const currentEvents = calendarEvents.filter((event) =>
              isSameDay(event.start, cellDate),
            );
            const matchingUnavailable = unavailableDates.find((u) =>
              isSameDay(new Date(u.date), cellDate),
            );
            return (
              <div
                key={cellDate.toString()}
                className={`relative flex h-24 flex-col border p-2 shadow-sm ${
                  matchingUnavailable ? "bg-red-50" : "bg-white"
                }`}
              >
                <div className="flex justify-end">
                  <span
                    className={`text-xs font-bold ${
                      isSameDay(new Date(), cellDate)
                        ? "rounded-full bg-primary p-1 text-white"
                        : "text-gray-500"
                    }`}
                  >
                    {format(cellDate, "d")}
                  </span>
                </div>
                {matchingUnavailable && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-80">
                    <span className="text-center font-semibold text-red-600">
                      {matchingUnavailable.reason}
                    </span>
                  </div>
                )}
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

  return (
    <>
      <Calendar
        defaultDate={new Date("2025-04-01")}
        events={calendarEvents}
        onEventClick={handleEventClick}
      >
        <div className="space-y-4">
          {/* Navigation Controls */}
          <div className="mx-5 flex flex-col items-center justify-between gap-2 sm:flex-row">
            <div className="flex items-center space-x-2">
              <CalendarPrevTrigger>
                <ChevronLeft />
              </CalendarPrevTrigger>
              <CalendarNextTrigger>
                <ChevronRight />
              </CalendarNextTrigger>
              <CalendarTodayTrigger>Today</CalendarTodayTrigger>
            </div>
            <div className="text-2xl font-semibold text-primary">
              <CalendarCurrentDate />
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CalendarViewTrigger
                view="week"
                className="bg-primary text-white"
              >
                Week
              </CalendarViewTrigger>
              <CalendarViewTrigger
                view="month"
                className="bg-primary text-white"
              >
                Month
              </CalendarViewTrigger>
            </div>
          </div>
          {/* Calendar Views */}
          <div className="p-2">
            <CalendarDayView />
            <CalendarWeekView />
            <CalendarMonthViewWithUnavailableDates />
          </div>
        </div>
      </Calendar>

      {/* Reservation Receipt Dialog with MySchedule Style */}
      <Dialog
        open={!!selectedReservation}
        onOpenChange={(open) => {
          if (!open) setSelectedReservation(null);
        }}
      >
        <DialogContent className="max-h-[80vh] w-full max-w-md overflow-y-auto p-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {selectedReservation?.fullName}
            </DialogTitle>
            <div className="mb-4 border-b pb-2">
              <div className="flex justify-between">
                <strong>Date:</strong>
                <span className="ml-auto">
                  {selectedReservation &&
                    format(new Date(selectedReservation.date), "PPpp")}
                </span>
              </div>
              <div className="flex justify-between">
                <strong>Time:</strong>
                <span className="ml-auto">
                  {selectedReservation &&
                    `${selectedReservation.startTime} - ${selectedReservation.endTime}`}
                </span>
              </div>
            </div>
          </DialogHeader>

          {/* Reservation Details */}
          <div className="mb-4 space-y-2">
            <div className="flex justify-between">
              <strong>Reservation Type:</strong>
              <span className="ml-auto">
                {selectedReservation?.reservationType}
              </span>
            </div>
            <div className="flex justify-between">
              <strong>Party Size:</strong>
              <span className="ml-auto">{selectedReservation?.partySize}</span>
            </div>
            <div className="flex justify-between">
              <strong>Contact:</strong>
              <span className="ml-auto">
                {selectedReservation?.contactNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <strong>Status:</strong>
              <span className="ml-auto">
                {selectedReservation?.eventStatus}
              </span>
            </div>
            <div className="flex justify-between">
              <strong>Payment Status:</strong>
              <span className="ml-auto">
                {selectedReservation?.paymentStatus}
              </span>
            </div>
            {selectedReservation?.specialRequest && (
              <div className="flex justify-between">
                <strong>Special Request:</strong>
                <span className="ml-auto">
                  {selectedReservation.specialRequest}
                </span>
              </div>
            )}
          </div>

          {/* Cart Items Section */}
          {selectedReservation?.cart && selectedReservation.cart.length > 0 && (
            <div className="mb-4">
              <strong>Cart Items:</strong>
              <ul className="mt-2 space-y-2">
                {selectedReservation.cart.map((item) => (
                  <li
                    key={item._id}
                    className="flex items-center gap-2 rounded border p-2"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-16 w-16 rounded object-cover"
                    />
                    <div className="flex flex-col">
                      <div className="font-bold">{item.title}</div>
                      <div>
                        Qty: {item.quantity} | Total: ₱{item.totalPrice}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Order Summary Section */}
          <div className="mb-4">
            <strong>Order Summary:</strong>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Order Subtotal:</span>
                <span className="ml-auto">
                  ₱{selectedReservation?.subtotal}
                </span>
              </div>
              {selectedReservation?.eventFee !== undefined && (
                <div className="flex justify-between">
                  <span>Event Fee:</span>
                  <span className="ml-auto">
                    ₱{selectedReservation.eventFee}
                  </span>
                </div>
              )}
              {/* ✅ Only show Corkage Fee if `isCorkage` is true */}
              {selectedReservation?.isCorkage && (
                <div className="flex justify-between">
                  <span>Corkage Fee:</span>
                  <span className="ml-auto">
                    ₱{settings?.eventCorkageFee || 0}
                  </span>
                </div>
              )}
            </div>
            {/* Horizontal line to separate details from total */}
            <hr className="my-3 border-gray-400" />
            <div className="flex justify-between text-base font-bold">
              <span>Total Payment:</span>
              <span className="ml-auto">
                ₱{selectedReservation?.totalPayment}
              </span>
            </div>
          </div>

          <DialogClose className="mt-4 rounded bg-primary px-4 py-2 text-white">
            Close
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReservationCalendar;
