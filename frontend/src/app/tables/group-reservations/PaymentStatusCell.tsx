import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GroupReservation } from "@/features/Events/api/group";
import { useUpdateGroupReservationPaymentStatus } from "@/features/Events/hooks/useUpdateGroupReservationPaymentStatus";
import { useSendNotificationToUser } from "@/notifications/hooks/useSendNotificationToUser";

const PaymentStatusCell = ({
  reservation,
}: {
  reservation: GroupReservation;
}): JSX.Element => {
  const { mutate } = useUpdateGroupReservationPaymentStatus();
  const { mutate: sendNotification } = useSendNotificationToUser();

  const updatePaymentStatus = (newStatus: string) => {
    mutate({
      reservationId: reservation._id,
      paymentStatus: newStatus,
    });

    // Fixed: use userId instead of user
    if (reservation.userId._id) {
      sendNotification({
        title: "PAYMENT STATUS UPDATE:",
        description: `Your payment status has been updated to: ${newStatus}`,
        userId: reservation.userId._id,
        _id: "",
        read: false,
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
