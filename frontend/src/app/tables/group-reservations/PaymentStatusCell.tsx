// src/components/PaymentStatusCell.tsx
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
import { GroupReservation } from "@/features/Events/api/group";
import { useUpdateGroupReservationPaymentStatus } from "@/features/Events/hooks/useUpdateGroupReservationPaymentStatus";

const PaymentStatusCell = ({
  reservation,
}: {
  reservation: GroupReservation;
}): JSX.Element => {
  const { mutate } = useUpdateGroupReservationPaymentStatus();

  // State to store the selected payment status and control the dialog.
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Handle dropdown item click: store the payment status and open the confirmation dialog.
  const handlePaymentStatusSelection = (status: string) => {
    setSelectedPaymentStatus(status);
    // Delay to ensure dropdown has closed.
    setTimeout(() => {
      setIsDialogOpen(true);
    }, 100);
  };

  // Confirm the payment status change.
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
          <Button variant="outline" className="h-8 w-20 px-12">
            {reservation.paymentStatus}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => handlePaymentStatusSelection("Not Paid")}
          >
            Not Paid
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handlePaymentStatusSelection("Partially Paid")}
          >
            Partially Paid
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handlePaymentStatusSelection("Paid")}
          >
            Paid
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog */}
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
