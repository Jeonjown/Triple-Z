// GroupDeleteReservationDialog.tsx
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useDeleteGroupReservation } from "@/features/Events/hooks/useDeleteGroupReservation";

interface GroupDeleteReservationDialogProps {
  reservationId: string;
}

const GroupDeleteReservationDialog: React.FC<
  GroupDeleteReservationDialogProps
> = ({ reservationId }) => {
  const { mutate } = useDeleteGroupReservation();

  const handleDelete = (): void => {
    console.log("Deleting reservation:", reservationId);
    mutate(reservationId);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="flex cursor-pointer items-center rounded-sm px-2 py-1 hover:!bg-red-200"
        >
          Delete
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete reservation{" "}
            <strong>{reservationId}</strong> permanently?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GroupDeleteReservationDialog;
