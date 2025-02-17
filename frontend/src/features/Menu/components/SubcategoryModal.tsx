import React from "react";
import { useEditSubcategory } from "../hooks/useEditSubcategory";
import EditSubcategoryConfirmationModal from "./EditSubcategoryConfirmationModal";
import { useCreateSubcategory } from "../hooks/useCreateSubcategory";
import { useDeleteSubcategory } from "../hooks/useDeleteSubcategory"; // Delete hook
import DeleteConfirmationModal from "./DeleteConfirmationModal"; // Shared shadcn dialog
import { Button } from "@/components/ui/button";
import { Plus, SquarePen, Trash2, X } from "lucide-react";

export interface SingleSubcategory {
  _id: string;
  subcategory: string;
}

interface SubcategoryModalProps {
  currentCategoryId: string | undefined;
  subcategoryData: SingleSubcategory[] | undefined;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentCategoryName: string | undefined;
}

function SubcategoryModal({
  setIsModalOpen,
  subcategoryData,
  currentCategoryId,
  currentCategoryName,
}: SubcategoryModalProps): JSX.Element {
  // ADD SUBCATEGORY
  const {
    isAddCategoryFormOpen,
    setIsAddCategoryFormOpen,
    itemToAdd,
    setItemToAdd,
    handleAddSubCategory,
  } = useCreateSubcategory();

  // EDIT SUBCATEGORY
  const {
    inputEditValue,
    setInputEditValue,
    setSubcategoryToEdit,
    setEditMode,
    editMode,
    subcategoryToEdit,
    handleSaveEdit,
    handleEditSubcategory,
    showEditConfirmation,
    setShowEditConfirmation,
  } = useEditSubcategory();

  // DELETE SUBCATEGORY
  const {
    mutate, // mutation function
    showConfirmation,
    setShowConfirmation,
    deleteTarget,
    handleDelete,
  } = useDeleteSubcategory();

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      {/* Delete Confirmation Modal */}
      {showConfirmation && deleteTarget && (
        <DeleteConfirmationModal
          showConfirmation={showConfirmation}
          setShowConfirmation={setShowConfirmation}
          target={deleteTarget.subcategory}
          action={() => {
            if (currentCategoryId) {
              mutate({
                categoryId: currentCategoryId,
                subcategoryId: deleteTarget._id,
              });
            } else {
              console.error("Current category is undefined!");
            }
          }}
        >
          All related items will also be lost.
        </DeleteConfirmationModal>
      )}

      {/* Edit Confirmation Modal */}
      {showEditConfirmation && (
        <EditSubcategoryConfirmationModal
          setShowEditConfirmation={setShowEditConfirmation}
          categoryId={currentCategoryId}
          setEditMode={setEditMode}
          subcategoryToEdit={subcategoryToEdit}
        />
      )}

      <div className="relative m-4 w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-lg">
        {/* Sticky Header: Close Button, Title, and Add Input */}
        <div className="sticky top-0 z-20 border-b border-gray-300 bg-white px-4 py-4">
          {/* Close Button Row */}
          <div className="flex h-14 items-center justify-end">
            <Button
              size={"icon"}
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-5"
            >
              <X className="!size-7 text-gray-700 hover:text-gray-900" />
            </Button>
          </div>
          {/* Title and Add Button */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">
              Edit Subcategories of {currentCategoryName}
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
          {/* Add Subcategory Input (non-scrollable) */}
          {isAddCategoryFormOpen && (
            <div className="mt-4">
              <div className="flex w-full rounded-md border border-gray-300">
                <input
                  name="title"
                  type="text"
                  id="title"
                  placeholder="Enter the subcategory"
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
                      if (currentCategoryId)
                        handleAddSubCategory(currentCategoryId);
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

        {/* Scrollable Subcategories List */}
        <div className="max-h-96 overflow-y-auto px-4 py-2">
          {subcategoryData &&
            subcategoryData.map((subcategory) => (
              <div
                key={subcategory._id}
                className="flex items-center justify-between border-b border-gray-300 py-3"
              >
                {editMode && subcategoryToEdit?._id === subcategory._id ? (
                  <div className="flex w-full">
                    <input
                      type="text"
                      value={inputEditValue}
                      onChange={(e) => {
                        setInputEditValue(e.target.value);
                        if (subcategoryToEdit) {
                          setSubcategoryToEdit({
                            ...subcategoryToEdit,
                            subcategory: e.target.value,
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
                    {subcategory.subcategory}
                  </span>
                )}

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    size={"icon"}
                    onClick={() => handleEditSubcategory(subcategory)}
                    className="ml-4"
                  >
                    <SquarePen />
                  </Button>
                  <Button
                    type="button"
                    size={"icon"}
                    variant={"destructive"}
                    onClick={() => handleDelete(subcategory)}
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
}

export default SubcategoryModal;
