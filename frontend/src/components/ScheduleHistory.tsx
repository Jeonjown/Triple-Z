import useAuthStore from "@/features/Auth/stores/useAuthStore";
import useGetReservations from "@/features/Events/hooks/useGetReservations";
import { format } from "date-fns";
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

// Define interfaces for explicit types
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

interface Reservation {
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

interface ReservationData {
  reservations: Reservation[];
}

const ScheduleHistory = () => {
  const { data } = useGetReservations() as { data?: ReservationData };
  const { user } = useAuthStore();

  // Get all reservations for the current user (display all statuses)
  const userReservations: Reservation[] =
    data?.reservations.filter(
      (reservation: Reservation) => reservation.userId._id === user?._id,
    ) || [];

  return (
    <div className="overflow-x-auto p-5">
      <h3 className="mb-4 text-xl font-semibold">Schedule History</h3>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border-y px-4 py-2">Date &amp; Time</th>
            <th className="border-y px-4 py-2">Event</th>
            <th className="border-y px-4 py-2">Party Size</th>
            <th className="border-y px-4 py-2">Special Request</th>
            <th className="border-y px-4 py-2">Status</th>
            <th className="border-y px-4 py-2">Payment</th>
            <th className="border-y px-4 py-2">ID</th>
            <th className="border-y px-4 py-2">Cart Details</th>
          </tr>
        </thead>
        <tbody>
          {userReservations.length > 0 ? (
            userReservations.map((reservation: Reservation) => (
              <tr key={reservation._id} className="hover:bg-gray-50">
                <td className="border-y px-4 py-2">
                  {format(new Date(reservation.date), "MMMM dd, yyyy")}
                  <br />
                  {reservation.startTime} - {reservation.endTime}
                </td>
                <td className="border-y px-4 py-2">{reservation.eventType}</td>
                <td className="border-y px-4 py-2">
                  {reservation.partySize} pax
                </td>
                <td className="border-y px-4 py-2">
                  {reservation.specialRequest}
                </td>
                <td className="border-y px-4 py-2">
                  {reservation.eventStatus}
                </td>
                <td className="border-y px-4 py-2">
                  <div>
                    <span className="block">{reservation.paymentStatus}</span>
                    <span className="block">₱{reservation.totalPayment}</span>
                  </div>
                </td>
                <td className="border-y px-4 py-2">
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
                </td>
                <td className="border-y px-4 py-2">
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
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-20 border-y px-4 py-2">
                              Image
                            </TableHead>
                            <TableHead className="border-y px-4 py-2">
                              Item
                            </TableHead>
                            <TableHead className="border-y px-4 py-2">
                              Quantity
                            </TableHead>
                            <TableHead className="border-y px-4 py-2 text-right">
                              Price
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {reservation.cart.map((item: CartItem) => (
                            <TableRow key={item._id}>
                              <TableCell className="border-y px-4 py-2">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="h-10 w-10 rounded object-cover"
                                />
                              </TableCell>
                              <TableCell className="border-y px-4 py-2">
                                {item.title}
                              </TableCell>
                              <TableCell className="border-y px-4 py-2">
                                {item.quantity}
                              </TableCell>
                              <TableCell className="border-y px-4 py-2 text-right">
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
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-2 text-center" colSpan={8}>
                No reservations found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleHistory;
