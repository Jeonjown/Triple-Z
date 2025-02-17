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
import { Dispatch, SetStateAction } from "react";
import { SingleCategory } from "./CategoryModal";
import { useEditCategory } from "../hooks/useEditCategory";

interface EditConfirmationModalProps {
  setEditMode: Dispatch<SetStateAction<boolean>>;
  setShowConfirmation: Dispatch<SetStateAction<boolean>>;
  categoryToEdit: SingleCategory | undefined;
}

const EditCategoryConfirmationModal = ({
  setShowConfirmation,
  setEditMode,
  categoryToEdit,
}: EditConfirmationModalProps) => {
  const { mutate: editCategory } = useEditCategory();

  return (
    <AlertDialog
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          // When the dialog is closed (by clicking outside, etc.), cancel the edit
          setShowConfirmation(false);
          setEditMode(false);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Update</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to edit "{categoryToEdit?.category}"? This
            action will update the category.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setShowConfirmation(false);
              setEditMode(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setShowConfirmation(false);
              setEditMode(false);
              if (categoryToEdit?._id && categoryToEdit.category) {
                editCategory({
                  categoryId: categoryToEdit._id,
                  category: categoryToEdit.category,
                });
              }
            }}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditCategoryConfirmationModal;
