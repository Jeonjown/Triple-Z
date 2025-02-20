import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateReservationPaymentStatus } from "@/features/Events/hooks/useUpdateReservationsPaymentStatus";
import { Reservation } from "./columns"; // Adjust the path as needed

// Component for updating payment status via a dropdown
const PaymentStatusCell = ({
  reservation,
}: {
  reservation: Reservation;
}): JSX.Element => {
  // Call the hook inside the component
  const { mutate } = useUpdateReservationPaymentStatus();

  // Update payment status by calling mutate with reservation id and new status
  const updatePaymentStatus = (newStatus: string) => {
    mutate({
      reservationId: reservation._id,
      paymentStatus: newStatus,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-8 w-20 p-0">
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
