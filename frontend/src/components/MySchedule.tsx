// MySchedule.tsx
import { startOfDay, compareDesc, format, isBefore } from "date-fns";
import useAuthStore from "@/features/Auth/stores/useAuthStore";
import { CalendarDays, Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import useGetEventReservations from "@/features/Events/hooks/useGetEventReservations";
import useGetGroupReservations from "@/features/Events/hooks/useGetGroupReservations";
import { useGetEventReservationSettings } from "@/features/Events/hooks/useGetEventReservationSettings";

// Define interfaces explicitly.
interface User {
  _id: string;
  username: string;
  email: string;
}

interface CartItem {
  _id: string;
  title: string;
  quantity: number;
  totalPrice: number;
  image: string;
}

export interface Reservation {
  _id: string;
  userId: User;
  fullName: string;
  contactNumber: string;
  partySize: number;
  date: string;
  startTime: string;
  endTime: string;
  eventType: string;
  cart: CartItem[];
  eventStatus: string;
  createdAt: string;
  updatedAt: string;
  specialRequest: string;
  totalPayment: number;
  eventFee: number;
  subtotal: number;
  paymentStatus: string;
  isCorkage: boolean;
  __v: number;
}

interface EventReservationData {
  reservations: Reservation[];
}

interface GroupReservationRaw {
  _id: string;
  userId: User;
  fullName: string;
  contactNumber: string;
  partySize: number;
  date: string;
  startTime: string;
  endTime: string;
  cart: CartItem[];
  eventStatus: string;
  paymentStatus: string;
  subtotal: number;
  totalPayment: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Map group reservation to our Reservation format.
const mapGroupToReservation = (group: GroupReservationRaw): Reservation => ({
  ...group,
  eventType: "Group Reservation",
  specialRequest: "",
  eventFee: 0,
  isCorkage: false, // default value for group reservations
});

const MySchedule = (): JSX.Element => {
  // Fetch event and group reservations.
  const { data } = useGetEventReservations() as { data?: EventReservationData };
  const { data: groupData } = useGetGroupReservations();
  const { user } = useAuthStore();
  const { data: settings } = useGetEventReservationSettings();

  // Normalize today's date.
  const today = startOfDay(new Date());

  // Filter event reservations.
  const eventReservations: Reservation[] =
    data?.reservations.filter((reservation) => {
      const reservationDate = startOfDay(new Date(reservation.date));
      return (
        reservation.userId._id === user?._id &&
        (reservation.eventStatus === "Pending" ||
          reservation.eventStatus === "confirmed") &&
        !isBefore(reservationDate, today)
      );
    }) || [];

  // Map and filter group reservations.
  const groupReservations: Reservation[] = groupData
    ? groupData
        .map((group: GroupReservationRaw) => mapGroupToReservation(group))
        .filter((reservation) => {
          const reservationDate = startOfDay(new Date(reservation.date));
          return (
            reservation.userId._id === user?._id &&
            (reservation.eventStatus === "Pending" ||
              reservation.eventStatus === "confirmed") &&
            !isBefore(reservationDate, today)
          );
        })
    : [];

  // Merge and sort reservations (most recent first).
  const allReservations = [...eventReservations, ...groupReservations].sort(
    (a, b) => compareDesc(new Date(a.date), new Date(b.date)),
  );

  // Define color mapping for statuses.
  const paymentStatusColors: Record<string, { border: string; bg: string }> = {
    "Not Paid": { border: "#EE4549", bg: "#EE454926" },
    "Partially Paid": { border: "#FABC2C", bg: "#FABC2C26" },
    Paid: { border: "#3BB537", bg: "#E2F4E1" },
  };

  const eventStatusColors: Record<string, { border: string; bg: string }> = {
    Pending: { border: "#FABC2C", bg: "#FABC2C26" },
    Confirmed: { border: "#3BB537", bg: "#E2F4E1" },
    Cancelled: { border: "#EE4549", bg: "#EE454926" },
    Completed: { border: "#043A7B", bg: "#043A7B26" },
  };

  return (
    <div className="p-4 sm:p-5">
      <h3 className="mb-4 text-center text-xl font-semibold sm:text-2xl">
        Upcoming Reservations
      </h3>
      {allReservations.length > 0 ? (
        allReservations.map((reservation) => {
          // Calculate total payment: add corkage fee if enabled.
          const computedTotal =
            reservation.subtotal +
            reservation.eventFee +
            (reservation.isCorkage ? settings?.eventCorkageFee || 0 : 0);

          // Get computed styles based on status
          const currentPaymentStyle = paymentStatusColors[
            reservation.paymentStatus
          ] || { border: "#ccc", bg: "#ccc" };

          const currentEventStyle = eventStatusColors[
            reservation.eventStatus
          ] || { border: "#ccc", bg: "#ccc" };

          return (
            <div
              key={reservation._id}
              className="my-4 rounded border-b p-4 shadow-sm"
            >
              {/* Reservation Header */}
              <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
                <div className="flex items-center space-x-2">
                  <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-lg font-bold sm:text-xl">
                    {format(new Date(reservation.date), "MMMM dd, yyyy")}
                  </span>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold sm:text-sm ${
                      reservation.eventType === "Group Reservation"
                        ? "bg-green-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {reservation.eventType}
                  </span>
                </div>
              </div>
              {/* Reservation Details */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-primary sm:text-base">Time:</p>
                    <span className="text-lg font-bold sm:text-xl">
                      {reservation.startTime} - {reservation.endTime}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-primary sm:text-base">
                      Party Size:
                    </p>
                    <p className="font-medium">{reservation.partySize} pax</p>
                  </div>
                  <div>
                    <p className="text-sm text-primary sm:text-base">
                      Special Request:
                    </p>
                    <p className="font-medium">
                      {reservation.specialRequest || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-primary sm:text-base">
                      Event Status:
                    </p>
                    {/* Render event status as a colored badge */}
                    <span
                      className="rounded-full px-2 py-1 text-xs font-bold"
                      style={{
                        border: `1px solid ${currentEventStyle.border}`,
                        backgroundColor: currentEventStyle.bg,
                      }}
                    >
                      {reservation.eventStatus}
                    </span>
                  </div>
                  {/* Payment Details */}
                  <div className="mt-4 space-y-2">
                    <div className="mb-6">
                      <p className="text-sm text-primary sm:text-base">
                        Payment Status:
                      </p>
                      {/* Render payment status as a colored badge */}
                      <span
                        className="rounded-full px-2 py-1 text-xs font-bold"
                        style={{
                          border: `1px solid ${currentPaymentStyle.border}`,
                          backgroundColor: currentPaymentStyle.bg,
                        }}
                      >
                        {reservation.paymentStatus}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs font-medium text-primary sm:text-sm">
                        ID: {reservation._id}
                      </p>
                      <TooltipProvider>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(reservation._id)
                              }
                              className="cursor-pointer text-gray-500 hover:text-gray-700"
                            >
                              <Copy size={16} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Copy Reservation ID</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
                {/* Cart Items & Totals */}
                <div>
                  <h4 className="text-sm text-primary sm:text-base">
                    Pre Ordered Menu
                  </h4>
                  {reservation.cart.length > 0 ? (
                    reservation.cart.map((item: CartItem) => (
                      <div
                        key={item._id}
                        className="my-2 flex items-center rounded bg-muted p-2"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-10 w-10 rounded object-cover sm:h-12 sm:w-12"
                        />
                        <div className="ml-4">
                          <p className="text-sm font-semibold sm:text-base">
                            {item.title}
                          </p>
                          <p className="text-xs sm:text-sm">
                            {item.quantity} x ₱{item.totalPrice}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                      No item selected
                    </p>
                  )}
                  <div className="mt-5 w-full">
                    <h4 className="text-sm font-semibold sm:text-base">
                      Total Summary:
                    </h4>
                    <div className="flex w-full justify-between text-xs sm:text-sm">
                      <span className="text-primary">Order Subtotal:</span>
                      <p className="font-medium">₱{reservation.subtotal}</p>
                    </div>
                    <div className="flex w-full justify-between text-xs sm:text-sm">
                      <span className="text-primary">Event Fee:</span>
                      <p className="font-medium">₱{reservation.eventFee}</p>
                    </div>
                    {reservation.isCorkage && (
                      <div className="flex w-full justify-between text-xs sm:text-sm">
                        <span className="text-primary">Corkage Fee:</span>
                        <p className="font-medium">
                          ₱{settings?.eventCorkageFee || 0}
                        </p>
                      </div>
                    )}
                    <hr className="my-1 border-gray-700" />
                    <div className="flex w-full justify-between text-xs sm:text-sm">
                      <p className="font-bold">Total Payment:</p>
                      <p className="font-medium">₱{computedTotal}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">
          No upcoming reservations found.
        </p>
      )}
    </div>
  );
};

export default MySchedule;
