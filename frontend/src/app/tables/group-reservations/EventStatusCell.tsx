// src/components/EventStatusCell.tsx
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GroupReservation } from "./columns";

import { useNotificationSender } from "@/features/Notifications/hooks/useSendNotificationSender";
import { useUpdateGroupReservationStatus } from "@/features/Events/hooks/useUpdateGroupReservationStatus ";

interface EventStatusCellProps {
  reservation: GroupReservation;
}

const EventStatusCell = ({
  reservation,
}: EventStatusCellProps): JSX.Element => {
  const { mutate } = useUpdateGroupReservationStatus();

  // Initialize notification sender for the user associated with the reservation.
  console.log(reservation.userId._id);
  const { sendNotification } = useNotificationSender(reservation.userId._id);

  const updateStatus = (newStatus: string) => {
    mutate(
      {
        reservationId: reservation._id,
        eventStatus: newStatus,
      },
      {
        onSuccess: () => {
          // After updating the status, send a notification to the user.
          sendNotification({
            userId: reservation.userId._id,
            title: "Reservation Status Updated",
            description: `Your reservation status has been updated to ${newStatus}.`,
            // Update the redirect URL as needed.
            redirectUrl: "/profile",
          });
        },
        onError: (error) => {
          console.error("Error updating reservation status", error);
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
