// PaymentStatusCell.tsx
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
import { useUpdateGroupReservationPaymentStatus } from "@/features/Events/hooks/useUpdateGroupReservationPaymentStatus";

const PaymentStatusCell = ({
  reservation,
}: {
  reservation: GroupReservation;
}): JSX.Element => {
  const { mutate } = useUpdateGroupReservationPaymentStatus();
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Define color mapping for payment statuses (sync with event style)
  const statusColors: Record<string, { border: string; bg: string }> = {
    "Not Paid": { border: "#EE4549", bg: "#EE454926" },
    "Partially Paid": { border: "#FABC2C", bg: "#FABC2C26" },
    Paid: { border: "#3BB537", bg: "#E2F4E1" },
  };

  // Use current payment status to compute styles.
  const currentStyle = statusColors[reservation.paymentStatus] || {
    border: "#ccc",
    bg: "#ccc",
  };

  const handlePaymentStatusSelection = (status: string) => {
    setSelectedPaymentStatus(status);
    // Short delay to allow the dropdown to close before opening the dialog.
    setTimeout(() => setIsDialogOpen(true), 100);
  };

  const confirmPaymentStatusChange = () => {
    mutate({
      reservationId: reservation._id,
      paymentStatus: selectedPaymentStatus,
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
            className="h-8 w-28 px-12"
            style={{
              borderColor: currentStyle.border,
              backgroundColor: currentStyle.bg,
            }}
          >
            {reservation.paymentStatus}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Payment</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => handlePaymentStatusSelection("Not Paid")}
          >
            Not Paid
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handlePaymentStatusSelection("Paid")}
          >
            Paid
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the payment status to "
              {selectedPaymentStatus}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmPaymentStatusChange}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentStatusCell;
