import React from "react";
import { startOfDay, compareDesc, format, isBefore } from "date-fns";
import useAuthStore from "@/features/Auth/stores/useAuthStore";
import { CalendarDays, Copy, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useGetEventReservationSettings } from "@/features/Events/hooks/useGetEventReservationSettings";
import { Button } from "@/components/ui/button";
import { useGetAllReservations } from "@/features/Events/hooks/useGetAllReservations";
import { useCancelReservation } from "@/features/Events/hooks/useCancelReservation";

export interface CartItem {
  _id: string;
  title: string;
  quantity: number;
  totalPrice: number;
  image: string;
}

export interface Reservation {
  _id: string;
  userId: string;
  fullName: string;
  contactNumber: string;
  partySize: number;
  date: string;
  startTime: string;
  endTime: string;
  eventType?: string;
  cart: CartItem[];
  eventStatus: string;
  createdAt: string;
  specialRequest: string;
  totalPayment: number;
  eventFee?: number;
  subtotal: number;
  paymentStatus: string;
  isCorkage: boolean;
  reservationType?: string;
  __v: number;
}

interface ReservationRaw {
  _id: string;
  userId: { _id: string } | string | null;
  fullName: string;
  contactNumber: string;
  partySize: number;
  date: string;
  startTime: string;
  endTime: string;
  eventType?: string;
  cart: CartItem[];
  eventStatus: string;
  createdAt: string;
  specialRequest: string;
  totalPayment: number;
  eventFee?: number;
  subtotal: number;
  paymentStatus: string;
  isCorkage: boolean;
  reservationType?: string;
  __v: number;
}

const MySchedule: React.FC = () => {
  const { user } = useAuthStore();
  const { data, isLoading, error } = useGetAllReservations();
  const { data: settings } = useGetEventReservationSettings();
  const { mutate: cancelReservationMutate, isPending: isCanceling } =
    useCancelReservation();

  if (isLoading) return <p>Loading reservations...</p>;
  if (error) return <p>Error loading reservations: {error.message}</p>;

  // Filter out reservations with null/undefined userId
  const validReservations = (data?.reservations || []).filter(
    (r: ReservationRaw | null) =>
      r && r.userId !== null && r.userId !== undefined,
  ) as ReservationRaw[];

  // Normalize raw reservations.
  const allReservations: Reservation[] = validReservations.map((r) => {
    const normalizedUserId: string =
      typeof r.userId === "object" && r.userId !== null
        ? r.userId._id.toString()
        : (r.userId as string);
    return { ...r, userId: normalizedUserId };
  });

  // Normalize today's date.
  const today = startOfDay(new Date());

  // Filter upcoming reservations for the current user.
  const userReservations = allReservations.filter((reservation) => {
    const reservationDate = startOfDay(new Date(reservation.date));
    return (
      reservation.userId === user?._id &&
      !isBefore(reservationDate, today) &&
      (reservation.eventStatus.toLowerCase() === "pending" ||
        reservation.eventStatus.toLowerCase() === "confirmed")
    );
  });

  // Sort by createdAt descending (most recent first).
  const sortedReservations = userReservations.sort((a, b) =>
    compareDesc(new Date(a.createdAt), new Date(b.createdAt)),
  );

  // Color mappings for statuses.
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
      {sortedReservations.length > 0 ? (
        sortedReservations.map((reservation) => {
          if (!reservation) return null;
          // Calculate computed total payment.
          const computedTotal =
            reservation.subtotal +
            (reservation.eventFee || 0) +
            (reservation.isCorkage ? settings?.eventCorkageFee || 0 : 0);

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
                <div className="mt-2 flex space-x-2 sm:mt-0">
                  {reservation.eventType && (
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-bold sm:text-sm ${
                        reservation.eventType.toLowerCase() ===
                        "reservation group"
                          ? "bg-green-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {reservation.eventType}
                    </span>
                  )}
                  {reservation.reservationType && (
                    <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-bold text-gray-800 sm:text-sm">
                      {reservation.reservationType}
                    </span>
                  )}
                </div>
              </div>
              {/* Reservation Details */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Left Column */}
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
                    <p className="mb-1 text-sm text-primary sm:text-base">
                      Event Status:
                    </p>
                    <span
                      className="rounded-full px-2 py-1 text-xs font-bold sm:text-sm"
                      style={{
                        border: `1px solid ${currentEventStyle.border}`,
                        backgroundColor: currentEventStyle.bg,
                      }}
                    >
                      {reservation.eventStatus}
                    </span>
                  </div>
                  <div className="pb-3">
                    <p className="mb-1 text-sm text-primary sm:text-base">
                      Payment Status:
                    </p>
                    <span
                      className="rounded-full px-2 py-1 text-xs font-bold sm:text-sm"
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
                {/* Right Column */}
                <div className="flex flex-col">
                  <div>
                    <h4 className="text-sm text-primary sm:text-base">
                      Pre Ordered Menu
                    </h4>
                    {reservation.cart.length > 0 ? (
                      reservation.cart.map((item) => (
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
                  </div>
                  <div className="mt-5 w-full">
                    <h4 className="text-sm font-semibold sm:text-base">
                      Total Summary:
                    </h4>
                    <div className="flex w-full justify-between text-xs sm:text-sm">
                      <span className="text-primary">Order Subtotal:</span>
                      <p className="font-medium">₱{reservation.subtotal}</p>
                    </div>
                    {reservation.eventFee !== undefined && (
                      <div className="flex w-full justify-between text-xs sm:text-sm">
                        <span className="text-primary">Event Fee:</span>
                        <p className="font-medium">₱{reservation.eventFee}</p>
                      </div>
                    )}
                    {reservation.isCorkage && (
                      <div className="flex w-full justify-between text-xs sm:text-sm">
                        <span className="text-primary">Corkage Fee:</span>
                        <p className="font-medium">
                          ₱{settings?.eventCorkageFee || 0}
                        </p>
                      </div>
                    )}
                    <hr className="my-1 border-gray-700" />
                    <div className="mb-10 flex w-full justify-between text-xs sm:text-sm">
                      <p className="font-bold">Total Payment:</p>
                      <p className="font-medium">₱{computedTotal}</p>
                    </div>
                  </div>
                  {/* Cancel Reservation Confirmation Dialog with Info Tooltip */}
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="ml-auto mt-auto text-xs"
                          disabled={isCanceling}
                        >
                          {isCanceling ? "Cancelling..." : "Cancel Reservation"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Cancellation</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to cancel this reservation?
                            <br />
                            <span className="text-xs text-gray-500">
                              {reservation.reservationType === "Groups"
                                ? "(Group reservations can only be cancelled at least 3 hours before opening time.)"
                                : "(Event reservations must be cancelled at least 1 week in advance.)"}
                            </span>
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline">Keep Reservation</Button>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              cancelReservationMutate(reservation._id);
                            }}
                          >
                            Confirm Cancel
                          </Button>
                        </div>
                        <DialogClose />
                      </DialogContent>
                    </Dialog>
                    {/* Info Icon with Tooltip */}
                    <TooltipProvider>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Info
                            className="cursor-pointer text-gray-500 hover:text-gray-700"
                            size={24}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-md">
                            {reservation.reservationType === "Groups"
                              ? "Group reservations can only be cancelled at least 3 hours before opening time."
                              : "Event reservations must be cancelled at least 1 week in advance."}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
