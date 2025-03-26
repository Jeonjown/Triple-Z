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
import { useDeleteEventReservations } from "@/features/Events/hooks/useDeleteEventReservations";

interface DeleteReservationActionProps {
  reservationId: string;
}

const DeleteReservationAction = ({
  reservationId,
}: DeleteReservationActionProps): JSX.Element => {
  // Use the hook inside the component
  const { mutate } = useDeleteEventReservations();

  // Delete handler using the hook's mutate function
  const handleDelete = () => {
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

export default DeleteReservationAction;
