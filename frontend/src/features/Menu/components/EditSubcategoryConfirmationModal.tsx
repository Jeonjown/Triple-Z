import { Dispatch, SetStateAction } from "react";
import { useEditSubcategory } from "../hooks/useEditSubcategory";
import { SingleSubcategory } from "./SubcategoryModal";
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

interface EditConfirmationModalProps {
  setEditMode: Dispatch<SetStateAction<boolean>>;
  setShowEditConfirmation: Dispatch<SetStateAction<boolean>>;
  subcategoryToEdit: SingleSubcategory | undefined;
  categoryId: string | undefined;
}

const EditSubcategoryConfirmationModal = ({
  setShowEditConfirmation,
  setEditMode,
  subcategoryToEdit,
  categoryId,
}: EditConfirmationModalProps) => {
  const { mutate: editSubcategory } = useEditSubcategory();

  return (
    <AlertDialog
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          // When the dialog is closed, cancel the edit mode and hide the confirmation
          setShowEditConfirmation(false);
          setEditMode(false);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Update</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to edit "{subcategoryToEdit?.subcategory}"?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setShowEditConfirmation(false);
              setEditMode(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setShowEditConfirmation(false);
              setEditMode(false);
              if (
                subcategoryToEdit?._id &&
                categoryId &&
                subcategoryToEdit.subcategory
              ) {
                editSubcategory({
                  categoryId,
                  subcategoryId: subcategoryToEdit._id,
                  subcategoryName: subcategoryToEdit.subcategory,
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

export default EditSubcategoryConfirmationModal;
