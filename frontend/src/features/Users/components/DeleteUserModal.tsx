import { User } from "../pages/ManageUsers";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteUserModalProps {
  user: User | null;
  handleConfirmDelete: (value: string) => void;
  handleCloseModal: () => void;
}

const DeleteUserModal = ({
  user,
  handleConfirmDelete,
  handleCloseModal,
}: DeleteUserModalProps) => {
  if (!user) return null;

  return (
    <AlertDialog open={!!user} onOpenChange={handleCloseModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            {user.username} and remove their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCloseModal}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleConfirmDelete(user._id)}
            className="bg-destructive"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserModal;
