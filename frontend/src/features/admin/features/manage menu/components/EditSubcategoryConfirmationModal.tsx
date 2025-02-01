import { Dispatch, SetStateAction } from "react";
import { useEditSubcategory } from "../hooks/useEditSubcategory";
import { SingleSubcategory } from "./SubcategoryModal";

interface EditConfirmationModalProps {
  setEditMode: Dispatch<SetStateAction<boolean>>;
  setShowEditConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-5/6 max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Confirm Update</h2>
        {/* <p>Are you sure you want to Edit "{categoryName}"?</p>{" "} */}
        {/* Access category from target object */}
        <div className="mt-4 flex justify-between">
          <button
            className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
            onClick={() => {
              setShowEditConfirmation(false); // Close modal
              setEditMode(false);
            }}
          >
            Cancel
          </button>
          <button
            className="rounded bg-red-600 px-4 py-2 text-white hover:opacity-85"
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
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSubcategoryConfirmationModal;
