// GroupViewCart.tsx
import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { GroupReservation } from "./columns";

const GroupViewCart: React.FC<{ reservation: GroupReservation }> = ({
  reservation,
}) => {
  const [openCartDialog, setOpenCartDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(reservation._id)}
          >
            Copy reservation ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenCartDialog(true)}>
            View Cart
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* Optionally add delete or other actions */}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={openCartDialog} onOpenChange={setOpenCartDialog}>
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
            {/* Compute total payment as needed */}
            <div className="flex justify-between">
              <p className="font-bold">Total Payment:</p>
              <p className="font-medium">
                ₱
                {reservation.totalPayment
                  ? reservation.totalPayment.toLocaleString()
                  : 0}
              </p>
            </div>
          </div>
          <DialogClose className="absolute right-4 top-4" />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GroupViewCart;
