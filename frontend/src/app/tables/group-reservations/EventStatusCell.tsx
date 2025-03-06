import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GroupReservation } from "./columns";
import { useUpdateGroupReservationStatus } from "@/features/Events/hooks/useUpdateGroupReservationStatus ";

const EventStatusCell = ({
  reservation,
}: {
  reservation: GroupReservation;
}): JSX.Element => {
  const { mutate } = useUpdateGroupReservationStatus();

  const updateStatus = (newStatus: string) => {
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
        <DropdownMenuItem onClick={() => updateStatus("Pending")}>
          Pending
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStatus("Confirmed")}>
          Confirmed
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStatus("Cancelled")}>
          Cancelled
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStatus("Completed")}>
          Completed
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EventStatusCell;
