import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Reservation } from "./columns";
import { useGetEventReservationSettings } from "@/features/Events/hooks/useGetEventReservationSettings";

interface CartDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation;
}

const CartDetailsDialog: React.FC<CartDetailsDialogProps> = ({
  open,
  onOpenChange,
  reservation,
}) => {
  const { data: settings } = useGetEventReservationSettings();
  const corkageFee = reservation.isCorkage
    ? (settings?.eventCorkageFee ?? 0)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-auto">
        <DialogHeader>
          <DialogTitle>Cart Details</DialogTitle>
          <DialogDescription>
            Details of the pre-ordered menu items.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {reservation.cart.length > 0 ? (
            reservation.cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center rounded bg-muted p-2"
              >
                <img
                  src={item.image} // fixed: using correct image property
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
            <p>No items in cart</p>
          )}
        </div>
        <div className="mt-5">
          <h4 className="font-semibold">Total Summary:</h4>
          <div className="flex justify-between">
            <span className="text-primary">Order Subtotal:</span>
            <p className="font-medium">₱{reservation.subtotal}</p>
          </div>
          <div className="flex justify-between">
            <span className="text-primary">Event Fee:</span>
            <p className="font-medium">₱{reservation.eventFee}</p>
          </div>
          {reservation.isCorkage && (
            <div className="flex justify-between">
              <span className="text-primary">Corkage Fee:</span>
              <p className="font-medium">₱{corkageFee}</p>
            </div>
          )}
          <hr className="my-1 border-black" />
          <div className="flex justify-between">
            <p className="font-bold">Total Payment:</p>
            <p className="font-medium">₱{reservation.totalPayment}</p>
          </div>
        </div>
        <DialogClose className="absolute right-4 top-4" />
      </DialogContent>
    </Dialog>
  );
};

export default CartDetailsDialog;
