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
import { useGetAllReservationsByUser } from "@/features/Events/hooks/useGetAllReservationsByUser"; // Import the hook
import { useCancelReservation } from "@/features/Events/hooks/useCancelReservation";

// Define CartItem interface (ensure it matches your backend/frontend structure)
export interface CartItem {
  _id: string;
  title: string;
  quantity: number;
  totalPrice: number;
  image: string;
  size?: string; // Added size based on sample data
  isAddOn?: boolean; // Added isAddOn based on sample data
}

// Define Reservation interface (ensure it matches your backend/frontend structure)
export interface Reservation {
  _id: string;
  userId: {
    // Assuming userId is populated in the response
    _id: string;
    username: string;
    email: string;
  };
  fullName: string;
  contactNumber: string;
  partySize: number;
  date: string; // ISO string
  startTime: string; // e.g., "10:00 AM"
  endTime: string; // e.g., "06:00 PM"
  estimatedEventDuration?: number; // Added based on backend
  eventType?: string; // e.g., "Meeting", "Seminar"
  cart: CartItem[];
  eventStatus: string; // e.g., "Pending", "Confirmed", "Cancelled", "Completed"
  createdAt: string; // ISO string
  specialRequest: string;
  totalPayment: number; // Total reservation price
  eventFee: number; // Event fee applied
  subtotal: number; // Cart subtotal
  paymentStatus: string; // e.g., "Not Paid", "Partially Paid", "Paid"
  paymentMethod?: string; // Added paymentMethod based on usage
  isCorkage: boolean;
  corkageFee?: number; // Added based on backend
  reservationType: string; // e.g., "Event", "Groups"
  paymentLink?: string | null; // Payment link URL (optional, can be null)
  paymentData?: any | null; // Payment gateway response data (optional, can be null)
  balanceDue?: number; // Added based on backend
  __v: number;
}

const MySchedule: React.FC = () => {
  const { user } = useAuthStore();
  // Use the hook to fetch reservations
  const { data, isLoading, error } = useGetAllReservationsByUser(user?._id);
  // Use the hook to fetch settings (needed for corkage fee display)
  const { data: settings } = useGetEventReservationSettings();
  // Use the hook for cancelling reservations
  const { mutate: cancelReservationMutate, isPending: isCanceling } =
    useCancelReservation();

  // Show loading, error, or no user state
  if (!user) return <p>Please log in to view your schedule.</p>;
  if (isLoading) return <p>Loading reservations...</p>;
  if (error) return <p>Error loading reservations: {error.message}</p>;

  // Normalize today's date to compare just the date part
  const today = startOfDay(new Date());

  // Filter upcoming reservations (date is today or in the future, and status is Pending or Confirmed)
  const upcomingReservations = (data?.reservations || []).filter(
    (reservation: Reservation) => {
      // Explicitly type reservation
      const reservationDate = startOfDay(new Date(reservation.date));
      return (
        !isBefore(reservationDate, today) && // Date is today or after today
        (reservation.eventStatus.toLowerCase() === "pending" ||
          reservation.eventStatus.toLowerCase() === "confirmed")
      );
    },
  );

  // Sort by creation date descending (most recent first)
  const sortedReservations = upcomingReservations.sort((a, b) =>
    compareDesc(new Date(a.createdAt), new Date(b.createdAt)),
  );

  // Color mappings for statuses for visual styling
  const paymentStatusColors: Record<string, { border: string; bg: string }> = {
    "Not Paid": { border: "#EE4549", bg: "#EE454926" }, // Red
    "Partially Paid": { border: "#FABC2C", bg: "#FABC2C26" }, // Yellow/Orange
    Paid: { border: "#3BB537", bg: "#E2F4E1" }, // Green
    // Add other statuses if needed
  };

  const eventStatusColors: Record<string, { border: string; bg: string }> = {
    Pending: { border: "#FABC2C", bg: "#FABC2C26" }, // Yellow/Orange
    Confirmed: { border: "#3BB537", bg: "#E2F4E1" }, // Green
    Cancelled: { border: "#EE4549", bg: "#EE454926" }, // Red
    Completed: { border: "#043A7B", bg: "#043A7B26" }, // Blue
    // Add other statuses if needed
  };

  // Helper function to format currency
  const formatCurrency = (amount?: number | null) =>
    amount != null ? `₱${amount.toFixed(2)}` : "₱--.--";

  return (
    <div className="p-4 sm:p-5">
      <h3 className="mb-4 text-center text-xl font-semibold sm:text-2xl">
        Upcoming Reservations
      </h3>
      {sortedReservations.length > 0 ? (
        // Map through each upcoming reservation
        sortedReservations.map((reservation) => {
          if (!reservation) return null;

          // Calculate computed total payment based on saved values
          // Note: The backend calculates totalPayment and balanceDue,
          // it's generally better to use those saved values if they are reliable.
          // Using computedTotal here might differ if backend calculation changes.
          // Let's use the saved totalPayment and balanceDue from the reservation object.
          const displayTotal = reservation.totalPayment;
          const displayBalanceDue = reservation.balanceDue ?? displayTotal; // Use balanceDue if available, else total

          // Get status styles
          const currentPaymentStyle = paymentStatusColors[
            reservation.paymentStatus
          ] || { border: "#ccc", bg: "#ccc" }; // Default style
          const currentEventStyle = eventStatusColors[
            reservation.eventStatus
          ] || { border: "#ccc", bg: "#ccc" }; // Default style

          return (
            <div
              key={reservation._id}
              className="my-4 rounded border-b p-4 shadow-sm"
            >
              {/* Reservation Header (Date and Type) */}
              <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
                <div className="flex items-center space-x-2">
                  <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-lg font-bold sm:text-xl">
                    {/* Format the date string */}
                    {format(new Date(reservation.date), "MMMM dd,yyyy")}
                  </span>
                </div>
                <div className="mt-2 flex space-x-2 sm:mt-0">
                  {/* Display Event Type if available */}
                  {reservation.eventType && (
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-bold sm:text-sm ${
                        // Simple color logic based on type
                        reservation.eventType.toLowerCase() ===
                        "reservation group"
                          ? "bg-green-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {reservation.eventType}
                    </span>
                  )}
                  {/* Display Reservation Type if available */}
                  {reservation.reservationType && (
                    <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-bold text-gray-800 sm:text-sm">
                      {reservation.reservationType}
                    </span>
                  )}
                </div>
              </div>

              {/* Reservation Details (Two Columns on medium screens) */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-2">
                  {/* Time */}
                  <div>
                    <p className="text-sm text-primary sm:text-base">Time:</p>
                    <span className="text-lg font-bold sm:text-xl">
                      {reservation.startTime} - {reservation.endTime}
                    </span>
                  </div>
                  {/* Party Size */}
                  <div>
                    <p className="text-sm text-primary sm:text-base">
                      Party Size:
                    </p>
                    <p className="font-medium">{reservation.partySize} pax</p>
                  </div>
                  {/* Special Request */}
                  <div>
                    <p className="text-sm text-primary sm:text-base">
                      Special Request:
                    </p>
                    <p className="font-medium">
                      {reservation.specialRequest || "N/A"}
                    </p>
                  </div>
                  {/* Payment Method */}
                  <div className="">
                    {/* Added pb-3 for spacing */}
                    <p className="mb-1 text-sm text-primary sm:text-base">
                      Payment Method:
                    </p>
                    <span className="rounded-full py-1 text-xs font-bold sm:text-sm">
                      {reservation.paymentMethod || "N/A"}{" "}
                      {/* Correctly displays the status, added fallback */}
                    </span>
                  </div>
                  {/* Event Status */}
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
                  {/* Payment Status */}
                  <div className="pb-3">
                    {" "}
                    {/* Added pb-3 for spacing */}
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
                      {reservation.paymentStatus}{" "}
                      {/* Correctly displays the status */}
                    </span>
                  </div>

                  {/* --- Conditional Payment Link Display --- */}
                  {/* Only render this section if paymentLink exists and is not null */}
                  {reservation.paymentLink && (
                    <div className="pb-3">
                      {" "}
                      {/* Use a div for spacing */}
                      <p className="mb-1 text-sm text-primary sm:text-base">
                        Payment Link: {/* <-- Updated label */}
                      </p>
                      {/* Use an anchor tag to make it a clickable link */}
                      <a
                        href={reservation.paymentLink}
                        target="_blank" // Open in a new tab
                        rel="noopener noreferrer" // Security best practice for target="_blank"
                        className="break-all text-xs font-medium text-blue-600 hover:underline sm:text-sm" // Basic link styling, break-all for long links
                      >
                        Click here to pay
                      </a>
                      {/* Optional: Add a copy button next to the link */}
                      <TooltipProvider>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  reservation.paymentLink!,
                                )
                              } // Use non-null assertion as we are inside the conditional check
                              className="ml-2 inline-flex cursor-pointer items-center text-gray-500 hover:text-gray-700" // Added inline-flex and items-center for alignment
                            >
                              <Copy size={16} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Copy Payment Link</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}

                  {/* Reservation ID and Copy button */}
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
                  {/* Pre Ordered Menu */}
                  <div>
                    <h4 className="text-sm text-primary sm:text-base">
                      Pre Ordered Menu
                    </h4>
                    {reservation.cart.length > 0 ? (
                      reservation.cart.map((item) => {
                        // Calculate the unit price (handle division by zero)
                        const unitPrice =
                          item.quantity > 0
                            ? item.totalPrice / item.quantity
                            : 0;

                        return (
                          <div
                            key={item._id}
                            className="my-2 flex items-center rounded bg-muted p-2"
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-10 w-10 rounded object-cover sm:h-12 sm:w-12"
                              // Add onError for fallback if image fails
                              onError={(
                                e: React.SyntheticEvent<
                                  HTMLImageElement,
                                  Event
                                >,
                              ) => {
                                // Explicitly type the event
                                const target = e.target as HTMLImageElement; // Cast target
                                target.onerror = null; // Prevent infinite loop
                                target.src = `https://placehold.co/48x48/e2e8f0/000000?text=No+Image`; // Placeholder
                              }}
                            />
                            <div className="ml-4 flex-grow">
                              {" "}
                              {/* Use flex-grow to push total to the right */}
                              <p className="text-sm font-semibold sm:text-base">
                                {item.title}
                              </p>
                              {/* Display size if available */}
                              {item.size && (
                                <p className="text-xs text-gray-600">
                                  Size: {item.size}
                                </p>
                              )}
                              <p className="text-xs sm:text-sm">
                                Qty: {item.quantity} x ₱{unitPrice.toFixed(2)}
                              </p>
                            </div>
                            {/* Display total price for the item */}
                            <div className="text-sm font-medium sm:text-base">
                              ₱{item.totalPrice.toFixed(2)}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                        No item selected
                      </p>
                    )}
                  </div>
                  {/* Total Summary */}
                  <div className="mt-5 w-full">
                    <h4 className="text-sm font-semibold sm:text-base">
                      Total Summary:
                    </h4>
                    <div className="flex w-full justify-between text-xs sm:text-sm">
                      <span className="text-primary">Order Subtotal:</span>
                      <p className="font-medium">
                        ₱{reservation.subtotal.toFixed(2)}
                      </p>{" "}
                      {/* Format currency */}
                    </div>
                    {/* Display Event Fee if available and non-zero */}
                    {reservation.eventFee !== undefined &&
                      reservation.eventFee > 0 && (
                        <div className="flex w-full justify-between text-xs sm:text-sm">
                          <span className="text-primary">Event Fee:</span>
                          <p className="font-medium">
                            ₱{reservation.eventFee.toFixed(2)}
                          </p>{" "}
                          {/* Format currency */}
                        </div>
                      )}
                    {/* Display Corkage Fee if isCorkage is true and settings are loaded */}
                    {reservation.isCorkage &&
                      settings?.eventCorkageFee !== undefined && (
                        <div className="flex w-full justify-between text-xs sm:text-sm">
                          <span className="text-primary">Corkage Fee:</span>
                          <p className="font-medium">
                            ₱{settings.eventCorkageFee.toFixed(2)}{" "}
                            {/* Use fee from settings, format currency */}
                          </p>
                        </div>
                      )}
                    <hr className="my-1 border-gray-700" />
                    <div className="mb-2 flex w-full justify-between text-xs sm:text-sm">
                      {" "}
                      {/* Adjusted mb */}
                      <p className="font-bold">Total Reservation Price:</p>{" "}
                      {/* Use more accurate label */}
                      <p className="font-medium">
                        ₱{displayTotal.toFixed(2)}
                      </p>{" "}
                      {/* Use saved totalPayment, format */}
                    </div>
                    {/* Display Balance Due if it's different from Total Price */}
                    {displayBalanceDue > 0 &&
                      displayBalanceDue !== displayTotal && (
                        <div className="flex w-full justify-between text-xs font-bold text-orange-700 sm:text-sm">
                          <span>Balance Due:</span>
                          <span>₱{displayBalanceDue.toFixed(2)}</span>{" "}
                          {/* Format currency */}
                        </div>
                      )}
                  </div>
                  {/* Cancel Reservation Confirmation Dialog with Info Tooltip */}
                  {/* Only show cancel button if eventStatus is Pending or Confirmed */}
                  {(reservation.eventStatus.toLowerCase() === "pending" ||
                    reservation.eventStatus.toLowerCase() === "confirmed") && (
                    <div className="mt-auto flex items-center space-x-2 pt-4">
                      {" "}
                      {/* Use mt-auto pt-4 to push to bottom */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="ml-auto text-xs" // Adjusted ml-auto
                            disabled={isCanceling} // Disable button while cancelling
                          >
                            {isCanceling
                              ? "Cancelling..."
                              : "Cancel Reservation"}
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
                            <DialogClose asChild>
                              {" "}
                              {/* Use DialogClose on the button */}
                              <Button variant="outline">
                                Keep Reservation
                              </Button>
                            </DialogClose>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                cancelReservationMutate(reservation._id); // Trigger the cancellation mutation
                              }}
                              disabled={isCanceling} // Disable while mutation is pending
                            >
                              {isCanceling ? "Cancelling..." : "Confirm Cancel"}
                            </Button>
                          </div>
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
                  )}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        // Message when no upcoming reservations are found
        <p className="text-center text-gray-500">
          No upcoming reservations found.
        </p>
      )}
    </div>
  );
};

export default MySchedule;
