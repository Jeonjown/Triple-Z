import { Dispatch, SetStateAction } from "react";
import { SingleCategory } from "./CategoryModal";
import { useEditCategory } from "../hooks/useEditCategory";

interface EditConfirmationModalProps {
  setEditMode: Dispatch<SetStateAction<boolean>>;
  setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  categoryToEdit: SingleCategory | undefined;
}

const EditCategoryConfirmationModal = ({
  setShowConfirmation,
  setEditMode,
  categoryToEdit,
}: EditConfirmationModalProps) => {
  const { mutate: editCategory } = useEditCategory();
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
              setShowConfirmation(false); // Close modal
              setEditMode(false);
            }}
          >
            Cancel
          </button>
          <button
            className="rounded bg-red-600 px-4 py-2 text-white hover:opacity-85"
            onClick={() => {
              setShowConfirmation(false);
              setEditMode(false);

              // Ensure categoryToEdit has _id and category
              if (categoryToEdit?._id && categoryToEdit.category) {
                editCategory({
                  categoryId: categoryToEdit._id,
                  category: categoryToEdit.category,
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

export default EditCategoryConfirmationModal;
