import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Reservation } from "./columns";
import { useUpdateEventReservationStatus } from "@/features/Events/hooks/useUpdateEventReservationsStatus";
import { useNotificationSender } from "@/features/Notifications/hooks/useSendNotificationSender";

const EventStatusCell = ({
  reservation,
}: {
  reservation: Reservation;
}): JSX.Element => {
  const { mutate } = useUpdateEventReservationStatus();
  const { sendNotification } = useNotificationSender(reservation.userId._id);

  // Function to update event status and, on success, send a notification.
  const updateEventStatus = (newStatus: string) => {
    mutate(
      {
        reservationId: reservation._id,
        eventStatus: newStatus,
      },
      {
        onSuccess: () => {
          sendNotification({
            userId: reservation.userId._id,
            title: "Reservation Status Updated",
            description: `Your reservation status has been updated to ${newStatus}.`,
            redirectUrl: "/profile", // Adjust the URL as needed
          });
        },
        onError: (error) => {
          console.error("Error updating reservation status:", error);
        },
      },
    );
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
