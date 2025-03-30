// GroupReservationActions.tsx
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
import GroupDeleteReservationDialog from "./GroupDeleteReservationDialog";
import GroupCartDetailsDialog from "./GroupCartDetailsDialog";
import GroupRescheduleReservationDialog from "./GroupRescheduleReservationDialog"; // New dialog component
import { GroupReservation } from "./columns";

const GroupReservationActions: React.FC<{ reservation: GroupReservation }> = ({
  reservation,
}) => {
  const [openCartDialog, setOpenCartDialog] = useState(false);
  const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false);
  console.log(reservation);
  const handleCopyId = (): void => {
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

          <DropdownMenuItem onClick={() => setOpenRescheduleDialog(true)}>
            Reschedule
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <GroupDeleteReservationDialog reservationId={reservation._id} />
        </DropdownMenuContent>
      </DropdownMenu>
      <GroupCartDetailsDialog
        open={openCartDialog}
        onOpenChange={setOpenCartDialog}
        reservation={reservation}
      />
      <GroupRescheduleReservationDialog
        open={openRescheduleDialog}
        onOpenChange={setOpenRescheduleDialog}
        reservation={reservation}
      />
    </>
  );
};

export default GroupReservationActions;
