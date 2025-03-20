import useAuthStore from "@/features/Auth/stores/useAuthStore";
import useGetReservations from "@/features/Events/hooks/useGetEventReservations";
import useGetGroupReservations from "@/features/Events/hooks/useGetGroupReservations";
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

// Define interfaces.
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
  __v: number;
}

interface EventReservationData {
  reservations: Reservation[];
}

// Raw group reservation interface.
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

// Map group reservations into the unified Reservation format.
const mapGroupToReservation = (group: GroupReservationRaw): Reservation => ({
  ...group,
  eventType: "Group Reservation", // Mark as Group Reservation.
  specialRequest: "",
  eventFee: 0,
});

const Cancelled = () => {
  // Get event reservations.
  const { data } = useGetReservations() as { data?: EventReservationData };
  // Get group reservations.
  const { data: groupData } = useGetGroupReservations();
  const { user } = useAuthStore();

  // Filter cancelled event reservations for the current user.
  const eventCancelled: Reservation[] =
    data?.reservations.filter(
      (reservation: Reservation) =>
        reservation.userId._id === user?._id &&
        reservation.eventStatus === "Cancelled",
    ) || [];

  // Map, then filter cancelled group reservations.
  const groupCancelled: Reservation[] = groupData
    ? groupData
        .map((group: GroupReservationRaw) => mapGroupToReservation(group))
        .filter(
          (reservation) =>
            reservation.userId._id === user?._id &&
            reservation.eventStatus === "Cancelled",
        )
    : [];

  // Merge and sort descending (most recent first).
  const mergedReservations = [...eventCancelled, ...groupCancelled].sort(
    (a, b) => compareDesc(new Date(a.date), new Date(b.date)),
  );

  return (
    <div className="overflow-x-auto p-5">
      <h3 className="mb-4 text-xl font-semibold">Cancelled Reservations</h3>
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="border-b border-gray-300 bg-gray-100">
            <TableHead className="px-4 py-2">Date & Time</TableHead>
            <TableHead className="px-4 py-2">Event</TableHead>
            <TableHead className="px-4 py-2">Party Size</TableHead>
            <TableHead className="px-4 py-2">Special Request</TableHead>
            <TableHead className="px-4 py-2">Status</TableHead>
            <TableHead className="px-4 py-2">Payment</TableHead>
            <TableHead className="px-4 py-2">ID</TableHead>
            <TableHead className="px-4 py-2">Cart Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mergedReservations.length > 0 ? (
            mergedReservations.map((reservation: Reservation) => (
              <TableRow
                key={reservation._id}
                className="border-b border-gray-300 hover:bg-gray-50"
              >
                <TableCell className="px-4 py-2">
                  <span className="font-bold">
                    {format(new Date(reservation.date), "MMMM dd, yyyy")}
                  </span>
                  <br />
                  <span>
                    {reservation.startTime} - {reservation.endTime}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-2">
                  <span className="text-xs font-bold">
                    {reservation.eventType}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-2">
                  {reservation.partySize} pax
                </TableCell>
                <TableCell className="px-4 py-2">
                  {reservation.specialRequest || "N/A"}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {reservation.eventStatus}
                </TableCell>
                <TableCell className="px-4 py-2">
                  <div>
                    <span className="block">{reservation.paymentStatus}</span>
                    <span className="block">₱{reservation.totalPayment}</span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-primary">
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
                          <p>Copy Reservation ID</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-blue-600 hover:underline">
                        View Cart Details
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cart Details</DialogTitle>
                        <DialogDescription>
                          Order details for this reservation.
                        </DialogDescription>
                      </DialogHeader>
                      <Table className="min-w-full">
                        <TableHeader>
                          <TableRow className="border-b border-gray-300">
                            <TableHead className="w-20 px-4 py-2">
                              Image
                            </TableHead>
                            <TableHead className="px-4 py-2">Item</TableHead>
                            <TableHead className="px-4 py-2">
                              Quantity
                            </TableHead>
                            <TableHead className="px-4 py-2 text-right">
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
                              <TableCell className="px-4 py-2">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="h-10 w-10 rounded object-cover"
                                />
                              </TableCell>
                              <TableCell className="px-4 py-2">
                                {item.title}
                              </TableCell>
                              <TableCell className="px-4 py-2">
                                {item.quantity}
                              </TableCell>
                              <TableCell className="px-4 py-2 text-right">
                                ₱{item.totalPrice}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Order Subtotal:</span>
                          <span>₱{reservation.subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Event Fee:</span>
                          <span>₱{reservation.eventFee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold">Total Payment:</span>
                          <span>₱{reservation.totalPayment}</span>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="px-4 py-2 text-center" colSpan={8}>
                No cancelled reservations history.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Cancelled;
