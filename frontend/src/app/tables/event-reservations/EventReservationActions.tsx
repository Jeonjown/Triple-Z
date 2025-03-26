// src/app/tables/event-reservations/EventReservationActions.tsx
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
import DeleteReservationDialog from "./DeleteReservationDialog";
import CartDetailsDialog from "./CartDetailsDialog";

import { Reservation } from "./columns";
import EditReservationDialog from "./RescheduleReservationDialog";

const EventReservationActions: React.FC<{ reservation: Reservation }> = ({
  reservation,
}) => {
  const [openCartDialog, setOpenCartDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(reservation._id);
  };

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
          <DropdownMenuItem onClick={handleCopyId}>
            Copy reservation ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenCartDialog(true)}>
            View Cart
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenEditDialog(true)}>
            Reschedule
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DeleteReservationDialog reservationId={reservation._id} />
        </DropdownMenuContent>
      </DropdownMenu>
      <CartDetailsDialog
        open={openCartDialog}
        onOpenChange={setOpenCartDialog}
        reservation={reservation}
      />
      <EditReservationDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        reservation={reservation}
      />
    </>
  );
};

export default EventReservationActions;
