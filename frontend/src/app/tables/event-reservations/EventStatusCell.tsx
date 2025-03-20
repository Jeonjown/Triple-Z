// src/components/EventStatusCell.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Reservation } from "./columns";
import { useUpdateEventReservationStatus } from "@/features/Events/hooks/useUpdateEventReservationsStatus";

const EventStatusCell = ({
  reservation,
}: {
  reservation: Reservation;
}): JSX.Element => {
  const { mutate } = useUpdateEventReservationStatus();

  // State to store the selected status and dialog open state.
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Set the status and open the confirmation dialog.
  const handleStatusSelection = (status: string) => {
    setSelectedStatus(status);
    setIsDialogOpen(true);
  };

  // Confirm the change and call the mutation.
  const confirmStatusChange = () => {
    mutate({
      reservationId: reservation._id,
      eventStatus: selectedStatus,
      userId: reservation.userId._id,
    });
    setIsDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-8 w-20 px-12">
            {reservation.eventStatus}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleStatusSelection("Pending")}>
            Pending
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusSelection("Confirmed")}>
            Confirmed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusSelection("Cancelled")}>
            Cancelled
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusSelection("Completed")}>
            Completed
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the event status to "
              {selectedStatus}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmStatusChange}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventStatusCell;
