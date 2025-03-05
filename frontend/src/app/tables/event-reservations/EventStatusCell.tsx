import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateReservationStatus } from "@/features/Events/hooks/useUpdateReservationsStatus";
import { Reservation } from "./columns";

// Component for updating event status via a dropdown
const EventStatusCell = ({
  reservation,
}: {
  reservation: Reservation;
}): JSX.Element => {
  const { mutate } = useUpdateReservationStatus();

  // Function to update event status
  const updateEventStatus = (newStatus: string) => {
    mutate({
      reservationId: reservation._id,
      eventStatus: newStatus,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-8 w-20 px-12">
          {reservation.eventStatus}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => updateEventStatus("Pending")}>
          Pending
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateEventStatus("Confirmed")}>
          Confirmed
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateEventStatus("Cancelled")}>
          Cancelled
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateEventStatus("Completed")}>
          Completed
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EventStatusCell;
