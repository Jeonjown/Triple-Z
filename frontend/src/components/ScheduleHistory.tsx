// ScheduleHistory.tsx
import useAuthStore from "@/features/Auth/stores/useAuthStore";
import useGetReservations from "@/features/Events/hooks/useGetEventReservations";
import useGetGroupReservations from "@/features/Events/hooks/useGetGroupReservations";
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

// Map a raw group reservation into the unified Reservation interface.
const mapGroupToReservation = (group: GroupReservationRaw): Reservation => ({
  ...group,
  eventType: "Group Reservation",
  specialRequest: "",
  eventFee: 0,
  isCorkage: false,
});

const ScheduleHistory = (): JSX.Element => {
  // Retrieve event and group reservations.
  const { data } = useGetReservations() as { data?: EventReservationData };
  const { data: groupData } = useGetGroupReservations();
  const { user } = useAuthStore();

  // Retrieve event settings for the corkage fee.
  const { data: settings } = useGetEventReservationSettings();

  // Filter reservations for the current user.
  const eventReservations: Reservation[] =
    data?.reservations.filter(
      (reservation) => reservation.userId._id === user?._id,
    ) || [];

  const groupReservations: Reservation[] = groupData
    ? groupData
        .map((group: GroupReservationRaw) => mapGroupToReservation(group))
        .filter((reservation) => reservation.userId._id === user?._id)
    : [];

  // Merge and sort reservations descending by date.
  const mergedReservations = [...eventReservations, ...groupReservations];
  const sortedReservations = mergedReservations.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date)),
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

  return (
    <div className="overflow-x-auto p-4 sm:p-5">
      <h3 className="mb-4 text-center text-xl font-semibold sm:text-2xl">
        Schedule History
      </h3>
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="border border-gray-300 bg-gray-100">
            <TableHead className="px-3 py-2 sm:px-4">Date &amp; Time</TableHead>
            <TableHead className="px-3 py-2 sm:px-4">Type</TableHead>
            <TableHead className="px-3 py-2 sm:px-4">Party Size</TableHead>
            <TableHead className="px-3 py-2 sm:px-4">Special Request</TableHead>
            <TableHead className="px-3 py-2 sm:px-4">Status</TableHead>
            <TableHead className="px-3 py-2 sm:px-4">Payment</TableHead>
            <TableHead className="px-3 py-2 sm:px-4">ID</TableHead>
            <TableHead className="px-3 py-2 sm:px-4">Cart Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedReservations.length > 0 ? (
            sortedReservations.map((reservation: Reservation) => {
              // Compute total payment including corkage fee if applicable.
              const computedTotal =
                reservation.subtotal +
                reservation.eventFee +
                (reservation.isCorkage ? settings?.eventCorkageFee || 0 : 0);

              // Get colors for event and payment statuses.
              const currentEventStyle = eventStatusColors[
                reservation.eventStatus
              ] || { border: "#ccc", bg: "#ccc" };
              const currentPaymentStyle = paymentStatusColors[
                reservation.paymentStatus
              ] || { border: "#ccc", bg: "#ccc" };

              return (
                <TableRow
                  key={reservation._id}
                  className="border-b border-gray-300 hover:bg-gray-50"
                >
                  <TableCell className="px-3 py-2 sm:px-4">
                    <span className="text-sm font-bold sm:text-base">
                      {format(new Date(reservation.date), "MMMM dd, yyyy")}
                    </span>
                    <br />
                    <span className="text-xs sm:text-sm">
                      {reservation.startTime} - {reservation.endTime}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-2 sm:px-4">
                    <span className="text-xs font-bold sm:text-sm">
                      {reservation.eventType}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-2 text-xs sm:text-sm">
                    {reservation.partySize} pax
                  </TableCell>
                  <TableCell className="px-3 py-2 text-xs sm:text-sm">
                    {reservation.specialRequest || "N/A"}
                  </TableCell>
                  <TableCell className="px-3 py-2 text-xs sm:text-sm">
                    {/* Event Status Badge */}
                    <span
                      style={{
                        display: "inline-block",
                        border: `1px solid ${currentEventStyle.border}`,
                        backgroundColor: currentEventStyle.bg,
                        borderRadius: "9999px",
                        padding: "0.125rem 0.5rem",
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {reservation.eventStatus}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-2 text-xs sm:px-4 sm:text-sm">
                    {/* Payment Column: Total Payment on Top & Payment Status Below */}
                    <div className="flex flex-col text-center">
                      <span className="block font-bold">₱{computedTotal}</span>
                      <span
                        style={{
                          display: "inline-block",
                          border: `1px solid ${currentPaymentStyle.border}`,
                          backgroundColor: currentPaymentStyle.bg,
                          borderRadius: "9999px",
                          padding: "0.125rem 0.5rem",
                          fontWeight: "bold",
                          fontSize: "0.75rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {reservation.paymentStatus}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-2 sm:px-4">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <span className="text-xs font-medium text-primary sm:text-sm">
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
                              <Copy size={16} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Copy Reservation ID</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-2 sm:px-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-xs text-blue-600 hover:underline sm:text-sm">
                          View Cart Details
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-sm sm:text-base">
                            Cart Details
                          </DialogTitle>
                          <DialogDescription className="text-xs sm:text-sm">
                            Order details for this reservation.
                          </DialogDescription>
                        </DialogHeader>
                        <Table className="min-w-full">
                          <TableHeader>
                            <TableRow className="border-b border-gray-300">
                              <TableHead className="w-20 px-3 py-2 text-xs sm:text-sm">
                                Image
                              </TableHead>
                              <TableHead className="px-3 py-2 text-xs sm:text-sm">
                                Item
                              </TableHead>
                              <TableHead className="px-3 py-2 text-xs sm:text-sm">
                                Quantity
                              </TableHead>
                              <TableHead className="px-3 py-2 text-right text-xs sm:text-sm">
                                Price
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {reservation.cart.map((item: CartItem) => (
                              <TableRow
                                key={item._id}
                                className="border-b border-gray-300"
                              >
                                <TableCell className="px-3 py-2">
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-8 w-8 rounded object-cover sm:h-10 sm:w-10"
                                  />
                                </TableCell>
                                <TableCell className="px-3 py-2 text-xs sm:text-sm">
                                  {item.title}
                                </TableCell>
                                <TableCell className="px-3 py-2 text-xs sm:text-sm">
                                  {item.quantity}
                                </TableCell>
                                <TableCell className="px-3 py-2 text-right text-xs sm:text-sm">
                                  ₱{item.totalPrice}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <div className="mt-3 space-y-2">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="font-medium">Order Subtotal:</span>
                            <span>₱{reservation.subtotal}</span>
                          </div>
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="font-medium">Event Fee:</span>
                            <span>₱{reservation.eventFee}</span>
                          </div>
                          {reservation.isCorkage && (
                            <div className="flex justify-between text-xs sm:text-sm">
                              <span className="font-medium">Corkage Fee:</span>
                              <span>₱{settings?.eventCorkageFee || 0}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="font-bold">Total Payment:</span>
                            <span>₱{computedTotal}</span>
                          </div>
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
                className="px-3 py-2 text-center text-xs sm:text-sm"
                colSpan={8}
              >
                No reservations found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ScheduleHistory;
