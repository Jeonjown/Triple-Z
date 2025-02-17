import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useDeleteCategory } from "../hooks/useDeleteCategory";
import { useEditCategory } from "../hooks/useEditCategory";
import { useCreateCategory } from "../hooks/useCreateCategory";
import EditCategoryConfirmationModal from "./EditCategoryConfirmationModal";
import { Button } from "@/components/ui/button";
import { X, Plus, SquarePen, Trash2 } from "lucide-react";

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
          target={deleteTarget.category}
          action={() => {
            deleteCategory(deleteTarget._id);
            setCurrentCategoryId(undefined);
          }}
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

      <div className="relative m-4 w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-lg">
        {/* Sticky Header: Close button, Title, and Add Category Input */}
        <div className="sticky top-0 z-20 border-b border-gray-300 bg-white px-4 py-4">
          {/* Close Button Row */}
          <div className="h-14">
            <Button
              size={"icon"}
              variant="ghost"
              onClick={() => setIsEditModalOpen(false)}
              className="absolute right-4 top-5"
            >
              <X className="!size-7 text-gray-700 hover:text-gray-900" />
            </Button>
          </div>
          {/* Title and Add Button */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">
              Edit Categories
            </h2>
            {!isAddCategoryFormOpen && (
              <Button
                type="button"
                size="icon"
                onClick={() => setIsAddCategoryFormOpen(true)}
                className="p-2 text-white transition-all hover:scale-110"
              >
                <Plus className="h-5 w-5" />
              </Button>
            )}
          </div>
          {/* Add Category Input (not scrollable) */}
          {isAddCategoryFormOpen && (
            <div className="mt-4">
              <div className="flex w-full rounded-md border border-gray-300">
                <input
                  name="title"
                  type="text"
                  id="title"
                  placeholder="Enter the category"
                  onChange={(e) => setItemToAdd(e.target.value)}
                  value={itemToAdd}
                  className="w-full rounded-l-md px-3 py-2 text-sm text-gray-800 placeholder-gray-500 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button
                  size={"lg"}
                  type="button"
                  onClick={() => {
                    if (!itemToAdd.trim()) {
                      // If there's no input, cancel adding
                      setIsAddCategoryFormOpen(false);
                    } else {
                      handleAddCategory();
                    }
                  }}
                  className="hover:bg-secondary-dark rounded-r-md bg-primary px-3 py-3 text-sm text-white transition-all focus:ring-1 focus:ring-primary"
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Categories List */}
        <div className="max-h-96 overflow-y-auto px-4 py-2">
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
                    <Button
                      type="button"
                      onClick={handleSaveEdit}
                      className="ml-2"
                    >
                      Ok
                    </Button>
                  </div>
                ) : (
                  <span className="text-lg font-medium text-gray-700">
                    {category.category}
                  </span>
                )}

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    size={"icon"}
                    onClick={() => handleEditCategory(category)}
                    className="ml-4"
                  >
                    <SquarePen />
                  </Button>
                  <Button
                    type="button"
                    size={"icon"}
                    variant={"destructive"}
                    onClick={() => handleDeleteCategory(category)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
