// EventStatusCell.tsx
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
import { GroupReservation } from "./columns";
import { useUpdateGroupReservationStatus } from "@/features/Events/hooks/useUpdateGroupReservationStatus ";

const EventStatusCell = ({
  reservation,
}: {
  reservation: GroupReservation;
}): JSX.Element => {
  const { mutate } = useUpdateGroupReservationStatus();
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Define color mapping for event statuses
  const statusColors: Record<string, { border: string; bg: string }> = {
    Pending: { border: "#FABC2C", bg: "#FABC2C26" },
    Confirmed: { border: "#3BB537", bg: "#E2F4E1" },
    Cancelled: { border: "#EE4549", bg: "#EE454926" },
    Completed: { border: "#043A7B", bg: "#043A7B26" },
  };

  // Get the current style based on the current event status
  const currentStyle = statusColors[reservation.eventStatus] || {
    border: "#ccc",
    bg: "#ccc",
  };

  const handleStatusSelection = (status: string) => {
    setSelectedStatus(status);
    setTimeout(() => setIsDialogOpen(true), 100);
  };

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
          <Button
            variant="outline"
            className="h-8 w-24 px-12"
            style={{
              borderColor: currentStyle.border,
              backgroundColor: currentStyle.bg,
            }}
          >
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
