import { useMemo, useState } from "react";
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
  CalendarEvent,
} from "@/components/ui/full-calendar";
import { useGetAllReservations } from "@/features/Events/hooks/useGetAllReservations";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, parse } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

// Define a type for each cart item.
interface CartItem {
  _id: string;
  title: string;
  quantity: number;
  price?: number;
  totalPrice: number;
  image: string;
  size: string;
}

// Updated Reservation type with cart and payment details.
interface IReservation {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
  };
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

// Extend the CalendarEvent type to include full reservation details.
interface ExtendedCalendarEvent extends CalendarEvent {
  details: IReservation;
}

const ReservationCalendar = () => {
  const { data: reservations } = useGetAllReservations();
  console.log("Reservations:", reservations);
  const [selectedReservation, setSelectedReservation] =
    useState<IReservation | null>(null);

  // Map reservations to typed calendar events.
  const calendarEvents: ExtendedCalendarEvent[] = useMemo(() => {
    if (!reservations || !reservations.reservations) return [];
    return reservations.reservations.map((res: IReservation) => {
      // Use format to get the base date string.
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
      // Always display fullName on calendar.
      const title = res.fullName;
      const color: "blue" | "pink" | "default" | "green" | "purple" =
        res.reservationType === "Event" ? "blue" : "pink";
      return { id: res._id, start, end, title, color, details: res };
    });
  }, [reservations]);

  const handleEventClick = (event: ExtendedCalendarEvent): void => {
    setSelectedReservation(event.details);
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
          <div className="mx-5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarPrevTrigger>
                <ChevronLeft />
              </CalendarPrevTrigger>
              <CalendarNextTrigger>
                <ChevronRight />
              </CalendarNextTrigger>
              <CalendarTodayTrigger>Today</CalendarTodayTrigger>
            </div>
            <div className="ml-2 text-2xl font-semibold text-primary">
              <CalendarCurrentDate />
            </div>
            {/* View Switcher */}
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
            <CalendarMonthView />
          </div>
        </div>
      </Calendar>

      {/* Reservation Receipt Dialog */}
      <Dialog
        open={!!selectedReservation}
        onOpenChange={(open) => {
          if (!open) setSelectedReservation(null);
        }}
      >
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            {/* Receipt Header */}
            <DialogTitle className="text-lg font-bold">
              {selectedReservation?.fullName}
            </DialogTitle>
            <div className="mb-2 border-b pb-2">
              <div>
                <strong>Date:</strong>{" "}
                {selectedReservation &&
                  format(new Date(selectedReservation.date), "PPpp")}
              </div>
              <div>
                <strong>Time:</strong>{" "}
                {selectedReservation &&
                  `${selectedReservation.startTime} - ${selectedReservation.endTime}`}
              </div>
            </div>
          </DialogHeader>
          {/* Receipt Body */}
          <div className="space-y-2">
            <div>
              <strong>Party Size:</strong> {selectedReservation?.partySize}
            </div>
            <div>
              <strong>Contact:</strong> {selectedReservation?.contactNumber}
            </div>
            <div>
              <strong>Status:</strong> {selectedReservation?.eventStatus}
            </div>
            <div>
              <strong>Payment Status:</strong>{" "}
              {selectedReservation?.paymentStatus}
            </div>
            {selectedReservation?.subtotal !== undefined && (
              <div>
                <strong>Subtotal:</strong> {selectedReservation.subtotal}
              </div>
            )}
            {selectedReservation?.eventFee !== undefined && (
              <div>
                <strong>Event Fee:</strong> {selectedReservation.eventFee}
              </div>
            )}
            {selectedReservation?.totalPayment !== undefined && (
              <div>
                <strong>Total Payment:</strong>{" "}
                {selectedReservation.totalPayment}
              </div>
            )}
            {selectedReservation?.reservationType && (
              <div>
                <strong>Reservation Type:</strong>{" "}
                {selectedReservation.reservationType}
              </div>
            )}
            {selectedReservation?.specialRequest && (
              <div>
                <strong>Special Request:</strong>{" "}
                {selectedReservation.specialRequest}
              </div>
            )}
            {selectedReservation?.cart &&
              selectedReservation.cart.length > 0 && (
                <div>
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
                        <div>
                          <div className="font-bold">{item.title}</div>
                          <div>
                            Qty: {item.quantity} | Total: {item.totalPrice}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
