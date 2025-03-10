import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Reservation } from "./columns"; // Adjust the path as needed

import { useUpdateEventReservationPaymentStatus } from "@/features/Events/hooks/useUpdateEventReservationsPaymentStatus";
import { useNotificationSender } from "@/features/Notifications/hooks/useSendNotificationSender";

// Component for updating payment status via a dropdown
const PaymentStatusCell = ({
  reservation,
}: {
  reservation: Reservation;
}): JSX.Element => {
  // Call the hook inside the component
  const { mutate } = useUpdateEventReservationPaymentStatus();
  const { sendNotification } = useNotificationSender(reservation.userId._id);

  // Update payment status by calling mutate with reservation id and new status
  const updatePaymentStatus = (newStatus: string) => {
    mutate({
      reservationId: reservation._id,
      paymentStatus: newStatus,
    });

    if (reservation.userId._id) {
      sendNotification({
        userId: reservation.userId._id,
        title: "Reservation Status Updated",
        description: `Your reservation status has been updated to ${newStatus}.`,
        // Update the redirect URL as needed.
        redirectUrl: "/profile",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-8 w-20 px-12">
          {reservation.paymentStatus}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => updatePaymentStatus("Not Paid")}>
          Not Paid
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updatePaymentStatus("Partially Paid")}>
          Partially Paid
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updatePaymentStatus("Paid")}>
          Paid
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PaymentStatusCell;
