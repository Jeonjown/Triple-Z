import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Copy, CalendarDays } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetAllReservationsByUser } from "@/features/Events/hooks/useGetAllReservationsByUser";

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

interface UserViewTransactionModalProps {
  userId: string; // Expects the userId (string)
  onClose?: () => void; // Optional onClose handler
}

const UserViewTransactionModal = ({
  userId,
  onClose,
}: UserViewTransactionModalProps) => {
  const {
    data: reservationsData, // Renamed to be more accurate
    isPending,
    isError,
    error,
  } = useGetAllReservationsByUser(userId);
  const userReservations = reservationsData?.reservations || [];

  console.log(userId, "");

  // Color mappings for statuses (you can adjust these)
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

  if (isPending) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>User Transactions</DialogTitle>
            <DialogDescription>
              Loading transactions for user...
            </DialogDescription>
          </DialogHeader>
          <p>Loading...</p>
        </DialogContent>
      </Dialog>
    );
  }

  if (isError) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>User Transactions</DialogTitle>
            <DialogDescription>
              Error loading transactions for user.
            </DialogDescription>
          </DialogHeader>
          <p>Error fetching data: {error?.message}</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>User Transactions</DialogTitle>
          <DialogDescription>All transactions for user.</DialogDescription>
        </DialogHeader>
        {userReservations.length > 0 ? (
          userReservations.map((reservation) => {
            const currentPaymentStyle = paymentStatusColors[
              reservation.paymentStatus
            ] || { border: "#ccc", bg: "#ccc" };
            const currentEventStyle = eventStatusColors[
              reservation.eventStatus
            ] || { border: "#ccc", bg: "#ccc" };

            const computedTotal =
              reservation.subtotal +
              (reservation.eventFee || 0) +
              (reservation.isCorkage ? 0 : 0); // Assuming you don't have settings here

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
                          <p className="font-medium">₱0</p>{" "}
                          {/* Assuming no settings here */}
                        </div>
                      )}
                      <hr className="my-1 border-gray-700" />
                      <div className="mb-10 flex w-full justify-between text-xs sm:text-sm">
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
          <p>No transactions found for this user.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserViewTransactionModal;
