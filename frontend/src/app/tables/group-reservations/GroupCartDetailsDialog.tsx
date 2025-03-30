// GroupCartDetailsDialog.tsx
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { GroupReservation } from "@/features/Events/api/group";

interface GroupCartDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: GroupReservation;
}

const GroupCartDetailsDialog: React.FC<GroupCartDetailsDialogProps> = ({
  open,
  onOpenChange,
  reservation,
}) => {
  // Compute total payment if not provided
  const totalPayment =
    reservation.totalPayment ||
    reservation.cart.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-auto">
        <DialogHeader>
          <DialogTitle>Cart Details</DialogTitle>
          <DialogDescription>
            Details of the pre-ordered items.
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
            <p>No items in cart</p>
          )}
        </div>
        <div className="mt-5">
          <div className="flex justify-between">
            <p className="font-bold">Total Payment:</p>
            <p className="font-medium">₱{totalPayment.toLocaleString()}</p>
          </div>
        </div>
        <DialogClose className="absolute right-4 top-4" />
      </DialogContent>
    </Dialog>
  );
};

export default GroupCartDetailsDialog;
