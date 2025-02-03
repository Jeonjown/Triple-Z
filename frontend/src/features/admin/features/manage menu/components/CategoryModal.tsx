import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useDeleteCategory } from "../hooks/useDeleteCategory";
import { useEditCategory } from "../hooks/useEditCategory";
import { useCreateCategory } from "../hooks/useCreateCategory";
import EditCategoryConfirmationModal from "./EditCategoryConfirmationModal";

export interface SingleCategory {
  category: string;
  _id: string;
}

interface CategoryEditModalProps {
  setIsEditModalOpen: (value: boolean) => void;
  categories: { category: string; _id: string }[];
  setCurrentCategoryId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
}

const CategoryModal = ({
  setIsEditModalOpen,
  categories,
  setCurrentCategoryId,
}: CategoryEditModalProps) => {
  // Create Category Hook
  const {
    handleAddCategory,
    isAddCategoryFormOpen,
    setIsAddCategoryFormOpen,
    itemToAdd,
    setItemToAdd,
  } = useCreateCategory();

  // Delete Category Hook
  const {
    mutate: deleteCategory,
    showConfirmation: deleteShowConfirmation,
    setShowConfirmation: setDeleteShowConfirmation,
    message: deleteMessage,
    handleDelete: handleDeleteCategory,
    deleteTarget,
  } = useDeleteCategory();

  // Edit Category Hook
  const {
    setEditMode,
    setInputEditValue,
    setCategoryToEdit,
    setShowEditConfirmation,
    inputEditValue,
    showEditConfirmation,
    categoryToEdit,
    editMode,
    handleSaveEdit,
    handleEditCategory,
  } = useEditCategory();

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      {deleteShowConfirmation && deleteTarget && (
        <DeleteConfirmationModal
          setShowConfirmation={setDeleteShowConfirmation}
          showConfirmation={deleteShowConfirmation}
          target={deleteTarget.category} // Display the target category name
          action={() => {
            deleteCategory(deleteTarget._id);
            setCurrentCategoryId(undefined);
          }} // Pass the category _id for deletion
        >
          {deleteMessage}
        </DeleteConfirmationModal>
      )}

      {showEditConfirmation && (
        <EditCategoryConfirmationModal
          setEditMode={setEditMode}
          setShowConfirmation={setShowEditConfirmation}
          categoryToEdit={categoryToEdit}
        />
      )}

      <div className="relative m-4 max-h-96 w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        {/* Close Button Container */}
        <div className="sticky top-0 z-20 flex w-full">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(false)}
            className="ml-auto text-gray-700 hover:text-gray-900"
          >
            {/* X Icon SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Header Container */}
        <div className="sticky top-8 mb-4 flex items-center justify-between bg-white pt-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Edit Categories
          </h2>
          {/* ADD BUTTON */}
          {!isAddCategoryFormOpen && (
            <button
              type="button"
              className="ml-4 rounded bg-secondary p-2 text-white transition-all hover:scale-110"
              onClick={() => setIsAddCategoryFormOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          )}
        </div>

        {isAddCategoryFormOpen && (
          <div className="flex items-center">
            <div className="mb-4 flex w-full rounded-md border border-gray-300">
              <input
                name="title"
                type="text"
                id="title"
                placeholder="Enter the category"
                onChange={(e) => setItemToAdd(e.target.value)}
                value={itemToAdd}
                className="w-full rounded-l-md px-3 py-2 text-sm text-gray-800 placeholder-gray-500 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="hover:bg-secondary-dark rounded-r-md bg-secondary px-3 py-3 text-sm text-white transition-all focus:ring-2 focus:ring-secondary"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Categories List */}
        {categories &&
          categories.map((category) => (
            <div
              key={category._id}
              className="flex items-center justify-between border-b border-gray-300 py-3"
            >
              {editMode && categoryToEdit?._id === category._id ? (
                <div className="flex w-full">
                  <input
                    type="text"
                    value={inputEditValue}
                    onChange={(e) => {
                      setInputEditValue(e.target.value);
                      if (categoryToEdit) {
                        setCategoryToEdit({
                          ...categoryToEdit,
                          category: e.target.value,
                        });
                      }
                    }}
                    className="w-full rounded-md border p-2"
                  />
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="ml-2 rounded bg-secondary px-3 text-sm text-white"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <span className="text-lg font-medium text-gray-700">
                  {category.category}
                </span>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => handleEditCategory(category)}
                  className="ml-4 rounded bg-secondary p-2 text-white transition-all hover:scale-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(category)}
                  className="flex items-center justify-center rounded bg-red-500 p-2 text-white transition-all hover:bg-red-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CategoryModal;
