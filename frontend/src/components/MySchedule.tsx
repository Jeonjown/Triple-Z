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
// Import hook for event settings (contains eventCorkageFee)
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

  // Get event settings for the corkage fee.
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

  return (
    <div className="p-5">
      <h3 className="text-xl font-semibold">Upcoming Reservations</h3>
      {allReservations.length > 0 ? (
        allReservations.map((reservation) => {
          // Calculate total payment: add corkage fee if enabled.
          const computedTotal =
            reservation.subtotal +
            reservation.eventFee +
            (reservation.isCorkage ? settings?.eventCorkageFee || 0 : 0);

          return (
            <div key={reservation._id} className="my-4 border-b p-4">
              {/* Reservation Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CalendarDays />
                  <span className="text-lg font-bold">
                    {format(new Date(reservation.date), "MMMM dd, yyyy")}
                  </span>
                </div>
                <div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold ${
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
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <p className="text-primary">Time:</p>
                    <span className="text-lg font-bold">
                      {reservation.startTime} - {reservation.endTime}
                    </span>
                  </div>
                  <div>
                    <p className="text-primary">Party Size:</p>
                    <p className="font-medium">{reservation.partySize} pax</p>
                  </div>
                  <div>
                    <p className="text-primary">Special Request:</p>
                    <p className="font-medium">
                      {reservation.specialRequest || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-primary">Event Status:</p>
                    <p className="font-medium">{reservation.eventStatus}</p>
                  </div>
                  {/* Payment Details */}
                  <div className="mt-4 space-y-2">
                    <div>
                      <p className="text-primary">Payment Status:</p>
                      <p className="font-medium">{reservation.paymentStatus}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs font-medium text-primary">
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
                            <p>Copy Reservation ID</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
                {/* Cart Items & Totals */}
                <div>
                  <h4 className="text-primary">Pre Ordered Menu</h4>
                  {reservation.cart.length > 0 ? (
                    reservation.cart.map((item: CartItem) => (
                      <div
                        key={item._id}
                        className="my-2 flex items-center bg-muted p-2"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-12 w-12 rounded object-cover"
                        />
                        <div className="ml-4">
                          <p className="font-semibold">{item.title}</p>
                          <p>
                            {item.quantity} x ₱{item.totalPrice}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="mt-2 text-gray-500">No item selected</p>
                  )}
                  <div className="mt-5 w-full">
                    <h4 className="font-semibold">Total Summary:</h4>
                    <div className="flex w-full justify-between">
                      <span className="text-primary">Order Subtotal:</span>
                      <p className="font-medium">₱{reservation.subtotal}</p>
                    </div>
                    <div className="flex w-full justify-between">
                      <span className="text-primary">Event Fee:</span>
                      <p className="font-medium">₱{reservation.eventFee}</p>
                    </div>
                    {/* Optionally show corkage fee */}
                    {reservation.isCorkage && (
                      <div className="flex w-full justify-between">
                        <span className="text-primary">Corkage Fee:</span>
                        <p className="font-medium">
                          ₱{settings?.eventCorkageFee || 0}
                        </p>
                      </div>
                    )}
                    <hr className="my-1 border-black" />
                    <div className="flex w-full justify-between">
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
        <p>No upcoming reservations found.</p>
      )}
    </div>
  );
};

export default MySchedule;
