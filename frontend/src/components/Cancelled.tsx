import React from "react";
import useAuthStore from "@/features/Auth/stores/useAuthStore";
import { useGetAllReservationsByUser } from "@/features/Events/hooks/useGetAllReservationsByUser"; // Import the new hook
import { useGetEventReservationSettings } from "@/features/Events/hooks/useGetEventReservationSettings";
import { format, compareDesc } from "date-fns";
import { Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Explicit interfaces.
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
  size?: string; // Added size based on sample data
  isAddOn?: boolean; // Added isAddOn based on sample data
}

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

const Cancelled = (): JSX.Element => {
  // Retrieve all reservations for the user using the hook.
  const { user } = useAuthStore();
  const { data, isLoading, error } = useGetAllReservationsByUser(user?._id) as {
    data?: { reservations: Reservation[] };
    isLoading: boolean;
    error: Error | null;
  };

  // Retrieve event settings for the corkage fee.
  const { data: settings } = useGetEventReservationSettings();

  // Filter for cancelled reservations.
  const cancelledReservations = (data?.reservations || []).filter(
    (reservation) => reservation.eventStatus.toLowerCase() === "cancelled",
  );

  // Sort reservations descending by creation date (most recent first).
  const sortedReservations = cancelledReservations.sort((a, b) =>
    compareDesc(new Date(a.createdAt), new Date(b.createdAt)),
  );

  // Define color mapping for event statuses.
  const eventStatusColors: Record<string, { border: string; bg: string }> = {
    Pending: { border: "#FABC2C", bg: "#FABC2C26" },
    Confirmed: { border: "#3BB537", bg: "#E2F4E1" },
    Cancelled: { border: "#EE4549", bg: "#EE454926" },
    Completed: { border: "#043A7B", bg: "#043A7B26" },
  };

  // Define color mapping for payment statuses.
  const paymentStatusColors: Record<string, { border: string; bg: string }> = {
    "Not Paid": { border: "#EE4549", bg: "#EE454926" },
    "Partially Paid": { border: "#FABC2C", bg: "#FABC2C26" },
    Paid: { border: "#3BB537", bg: "#E2F4E1" },
  };

  // Helper function to format currency
  const formatCurrency = (amount?: number | null) =>
    amount != null ? `₱${amount.toFixed(2)}` : "₱--.--";

  if (!user)
    return (
      <p className="p-4 text-center">
        Please log in to view your cancelled reservations.
      </p>
    );
  if (isLoading)
    return <p className="p-4 text-center">Loading cancelled reservations...</p>;
  if (error)
    return (
      <p className="p-4 text-center text-red-500">
        Error loading cancelled reservations: {error.message}
      </p>
    );

  return (
    <div className="overflow-x-auto p-4 sm:p-5">
      <h3 className="mb-4 text-center text-xl font-semibold sm:text-2xl">
        Cancelled Reservations
      </h3>
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="border border-gray-300 bg-gray-100">
            <TableHead className="px-3 py-2 text-left text-xs font-bold text-gray-700 sm:px-4 sm:text-sm">
              Date &amp; Time
            </TableHead>
            <TableHead className="px-3 py-2 text-left text-xs font-bold text-gray-700 sm:px-4 sm:text-sm">
              Type
            </TableHead>
            <TableHead className="px-3 py-2 text-left text-xs font-bold text-gray-700 sm:px-4 sm:text-sm">
              Reservation Type
            </TableHead>
            <TableHead className="px-3 py-2 text-left text-xs font-bold text-gray-700 sm:px-4 sm:text-sm">
              Party Size
            </TableHead>
            <TableHead className="px-3 py-2 text-left text-xs font-bold text-gray-700 sm:px-4 sm:text-sm">
              Special Request
            </TableHead>
            <TableHead className="px-3 py-2 text-left text-xs font-bold text-gray-700 sm:px-4 sm:text-sm">
              Event Status
            </TableHead>
            <TableHead className="px-3 py-2 text-left text-xs font-bold text-gray-700 sm:px-4 sm:text-sm">
              Payment Status
            </TableHead>{" "}
            {/* Added Payment Status header */}
            <TableHead className="px-3 py-2 text-left text-xs font-bold text-gray-700 sm:px-4 sm:text-sm">
              Payment Method
            </TableHead>{" "}
            {/* Added Payment Method header */}
            <TableHead className="px-3 py-2 text-left text-xs font-bold text-gray-700 sm:px-4 sm:text-sm">
              Total
            </TableHead>{" "}
            {/* Added Total header */}
            <TableHead className="px-3 py-2 text-left text-xs font-bold text-gray-700 sm:px-4 sm:text-sm">
              Payment Link
            </TableHead>{" "}
            {/* Added Payment Link header */}
            <TableHead className="px-3 py-2 text-left text-xs font-bold text-gray-700 sm:px-4 sm:text-sm">
              ID
            </TableHead>
            <TableHead className="px-3 py-2 text-left text-xs font-bold text-gray-700 sm:px-4 sm:text-sm">
              Cart Details
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedReservations.length > 0 ? (
            sortedReservations.map((reservation: Reservation) => {
              // Get colors for event and payment statuses.
              const currentEventStyle = eventStatusColors[
                reservation.eventStatus
              ] || {
                border: "#ccc",
                bg: "#ccc",
              };
              const currentPaymentStyle = paymentStatusColors[
                reservation.paymentStatus
              ] || {
                border: "#ccc",
                bg: "#ccc",
              };

              // Determine if Balance Due should be displayed in dialog
              const showBalanceDue =
                reservation.balanceDue != null &&
                reservation.balanceDue > 0 &&
                reservation.balanceDue !== reservation.totalPayment;

              return (
                <TableRow
                  key={reservation._id}
                  className="border-b border-gray-300 hover:bg-gray-50"
                >
                  {/* Date & Time */}
                  <TableCell className="min-w-[150px] whitespace-nowrap px-3 py-2 text-xs sm:px-4 sm:text-sm">
                    <span className="block font-bold">
                      {format(new Date(reservation.date), "MMMM dd,yyyy")}{" "}
                      {/* Corrected format string */}
                    </span>
                    <span className="block text-gray-600">
                      {reservation.startTime} - {reservation.endTime}
                    </span>
                  </TableCell>
                  {/* Event Type */}
                  <TableCell className="px-3 py-2 text-xs sm:px-4 sm:text-sm">
                    {reservation.eventType || "N/A"}
                  </TableCell>
                  {/* Reservation Type */}
                  <TableCell className="px-3 py-2 text-xs sm:px-4 sm:text-sm">
                    {reservation.reservationType || "N/A"}
                  </TableCell>
                  {/* Party Size */}
                  <TableCell className="px-3 py-2 text-xs sm:px-4 sm:text-sm">
                    {reservation.partySize} pax
                  </TableCell>
                  {/* Special Request */}
                  <TableCell className="px-3 py-2 text-xs sm:px-4 sm:text-sm">
                    {reservation.specialRequest || "N/A"}
                  </TableCell>
                  {/* Event Status */}
                  <TableCell className="px-3 py-2 text-xs sm:px-4 sm:text-sm">
                    <span
                      className="rounded-full px-2 py-1 text-xs font-bold"
                      style={{
                        border: `1px solid ${currentEventStyle.border}`,
                        backgroundColor: currentEventStyle.bg,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {reservation.eventStatus}
                    </span>
                  </TableCell>
                  {/* Payment Status */}
                  <TableCell className="px-3 py-2 text-xs sm:px-4 sm:text-sm">
                    <span
                      className="rounded-full px-2 py-1 text-xs font-bold"
                      style={{
                        border: `1px solid ${currentPaymentStyle.border}`,
                        backgroundColor: currentPaymentStyle.bg,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {reservation.paymentStatus}
                    </span>
                  </TableCell>
                  {/* Payment Method */}
                  <TableCell className="px-3 py-2 text-xs sm:px-4 sm:text-sm">
                    {reservation.paymentMethod || "N/A"}
                  </TableCell>
                  {/* Total Payment */}
                  <TableCell className="px-3 py-2 text-xs sm:px-4 sm:text-sm">
                    <span className="font-medium">
                      {formatCurrency(reservation.totalPayment)}
                    </span>
                  </TableCell>
                  {/* Payment Link */}
                  <TableCell className="px-3 py-2 text-xs sm:px-4 sm:text-sm">
                    {reservation.paymentLink ? (
                      <div className="flex items-center space-x-1">
                        <a
                          href={reservation.paymentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-blue-600 hover:underline"
                        >
                          View Link
                        </a>
                        <TooltipProvider>
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() =>
                                  navigator.clipboard.writeText(
                                    reservation.paymentLink!,
                                  )
                                }
                                className="cursor-pointer text-gray-500 hover:text-gray-700"
                              >
                                <Copy size={14} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Copy Payment Link</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ) : (
                      <span>N/A</span>
                    )}
                  </TableCell>
                  {/* Reservation ID with copy functionality */}
                  <TableCell className="px-3 py-2 text-xs sm:px-4 sm:text-sm">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <span className="font-medium text-primary">
                        {reservation._id}
                      </span>
                      <TooltipProvider>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(reservation._id)
                              }
                              className="cursor-pointer text-gray-500 hover:text-gray-700"
                            >
                              <Copy size={14} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Copy Reservation ID</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  {/* Cart Details */}
                  <TableCell className="px-3 py-2 text-xs sm:px-4 sm:text-sm">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-blue-600 hover:underline">
                          View Cart Details
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[80vh] min-w-fit overflow-y-auto">
                        {" "}
                        {/* Added max-h and overflow */}
                        <DialogHeader>
                          <DialogTitle className="text-base sm:text-lg">
                            {" "}
                            {/* Adjusted size */}
                            Cart Details
                          </DialogTitle>
                          <DialogDescription className="text-sm text-gray-600">
                            {" "}
                            {/* Adjusted size and color */}
                            Order details for this reservation.
                          </DialogDescription>
                        </DialogHeader>
                        {reservation.cart.length > 0 ? (
                          <Table className="mt-4 min-w-full">
                            {" "}
                            {/* Added mt-4 */}
                            <TableHeader>
                              <TableRow className="border-b border-gray-300">
                                <TableHead className="w-16 px-3 py-2 text-left text-xs font-bold text-gray-700 sm:w-20 sm:text-sm">
                                  {" "}
                                  {/* Adjusted width and text style */}
                                  Image
                                </TableHead>
                                <TableHead className="px-3 py-2 text-left text-xs font-bold text-gray-700 sm:text-sm">
                                  {" "}
                                  {/* Adjusted text style */}
                                  Item
                                </TableHead>
                                <TableHead className="px-3 py-2 text-left text-xs font-bold text-gray-700 sm:text-sm">
                                  {" "}
                                  {/* Adjusted text style */}
                                  Quantity
                                </TableHead>
                                <TableHead className="px-3 py-2 text-right text-xs font-bold text-gray-700 sm:text-sm">
                                  {" "}
                                  {/* Adjusted text style */}
                                  Price
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {reservation.cart.map((item: CartItem) => {
                                // Calculate unit price (handle division by zero).
                                const unitPrice =
                                  item.quantity > 0
                                    ? item.totalPrice / item.quantity
                                    : 0;
                                return (
                                  <TableRow
                                    key={item._id}
                                    className="border-b border-gray-200 hover:bg-gray-50" // Adjusted border and hover
                                  >
                                    <TableCell className="px-3 py-2">
                                      <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-8 w-8 rounded object-cover sm:h-10 sm:w-10"
                                        onError={(
                                          e: React.SyntheticEvent<
                                            HTMLImageElement,
                                            Event
                                          >,
                                        ) => {
                                          const target =
                                            e.target as HTMLImageElement;
                                          target.onerror = null;
                                          target.src = `https://placehold.co/40x40/e2e8f0/000000?text=No+Image`; // Placeholder
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell className="px-3 py-2 text-xs sm:text-sm">
                                      <span className="block font-medium">
                                        {item.title}
                                      </span>
                                      {item.size && (
                                        <span className="block text-xs text-gray-500">
                                          Size: {item.size}
                                        </span>
                                      )}
                                      {item.isAddOn && (
                                        <span className="block text-xs italic text-gray-500">
                                          (Add-on)
                                        </span>
                                      )}
                                    </TableCell>
                                    <TableCell className="px-3 py-2 text-xs sm:text-sm">
                                      {item.quantity} x{" "}
                                      {formatCurrency(unitPrice)}{" "}
                                      {/* Display quantity x unit price */}
                                    </TableCell>
                                    <TableCell className="px-3 py-2 text-right text-xs sm:text-sm">
                                      {formatCurrency(item.totalPrice)}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        ) : (
                          <p className="mt-2 text-center text-sm text-gray-500">
                            No items pre-ordered.
                          </p>
                        )}
                        <div className="mt-6 space-y-2 border-t pt-4">
                          {" "}
                          {/* Added border-t and pt-4 */}
                          <h4 className="text-sm font-semibold sm:text-base">
                            Summary:
                          </h4>
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="font-medium text-gray-700">
                              Order Subtotal:
                            </span>
                            <span>{formatCurrency(reservation.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="font-medium text-gray-700">
                              Event Fee:
                            </span>
                            <span>
                              {formatCurrency(reservation.eventFee || 0)}
                            </span>
                          </div>
                          {reservation.isCorkage &&
                            settings?.eventCorkageFee !== undefined && (
                              <div className="flex justify-between text-xs sm:text-sm">
                                <span className="font-medium text-gray-700">
                                  Corkage Fee:
                                </span>
                                <span>
                                  {formatCurrency(settings.eventCorkageFee)}
                                </span>
                              </div>
                            )}
                          <hr className="my-1 border-gray-300" />{" "}
                          {/* Adjusted border color */}
                          <div className="flex justify-between text-sm font-bold sm:text-base">
                            {" "}
                            {/* Adjusted font size and boldness */}
                            <span>Total Reservation Price:</span>{" "}
                            {/* More accurate label */}
                            <span>
                              {formatCurrency(reservation.totalPayment)}
                            </span>
                          </div>
                          {showBalanceDue && (
                            <div className="flex justify-between text-sm font-bold text-orange-700 sm:text-base">
                              {" "}
                              {/* Adjusted font size and color */}
                              <span>Balance Due:</span>
                              <span>
                                {formatCurrency(reservation.balanceDue)}
                              </span>
                            </div>
                          )}
                          {reservation.paymentLink && (
                            <div className="flex justify-between text-xs sm:text-sm">
                              <span className="font-medium text-gray-700">
                                Payment Link:
                              </span>
                              <a
                                href={reservation.paymentLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="break-all text-blue-600 hover:underline"
                              >
                                Click here to pay
                              </a>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                className="px-3 py-2 text-center text-xs text-gray-500 sm:text-sm"
                colSpan={12} // Updated colspan
              >
                No cancelled reservations found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Cancelled;
