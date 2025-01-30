import { useState } from "react";
import { useCreateCategory } from "../../hooks/useCreateCategory";
import { Category } from "../api/menu";
import { useDeleteCategory } from "../../hooks/useDeleteCategory";

interface CategoryEditModalProps {
  setIsEditModalOpen: (value: boolean) => void;
  categories: { category: string; _id: string }[];
}

const CategoryEditModal = ({
  setIsEditModalOpen,
  categories,
}: CategoryEditModalProps) => {
  const [isAddCategoryFormOpen, setIsAddCategoryFormOpen] =
    useState<boolean>(false);
  const [itemToAdd, setItemToAdd] = useState<string>("");

  const { mutate: createCategory } = useCreateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();

  // const handleDeleteCategory = () => {};

  const handleAddCategory = () => {
    if (itemToAdd.trim() !== "") {
      // Check if category is not empty
      const newCategory: Category = {
        category: itemToAdd,
        subcategories: [],
      };
      createCategory(newCategory);
      setIsAddCategoryFormOpen(false);
      setItemToAdd("");
    } else {
      console.error("Category name cannot be empty!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative m-4 max-h-96 w-full max-w-lg overflow-y-auto rounded-lg bg-gray-100 p-6 shadow-lg">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsEditModalOpen(false)}
          className="absolute right-4 top-4 text-gray-700 hover:text-gray-900"
        >
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

        <div className="mb-4 mt-10 flex items-center justify-between">
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
                onChange={(e) => setItemToAdd(e.target.value)} // Update itemToAdd with the input value
                value={itemToAdd} // Ensure the input value is controlled
                className="w-full rounded-l-md px-3 py-2 text-sm text-gray-800 placeholder-gray-500 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button
                type="button"
                onClick={handleAddCategory} // Trigger handleAddCategory on click
                className="hover:bg-secondary-dark rounded-r-md bg-secondary px-3 py-3 text-sm text-white transition-all focus:ring-2 focus:ring-secondary"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Categories List */}
        {categories.map((category) => (
          <div
            key={category._id}
            className="flex items-center justify-between border-b border-gray-300 py-3"
          >
            <span className="text-lg font-medium text-gray-700">
              {category.category}
            </span>
            <div className="flex space-x-3">
              {/* Edit Button */}
              {/* <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
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
              </button> */}
              {/* Delete Button */}
              <button
                type="button"
                onClick={() => {
                  const confirmDelete = window.confirm(
                    `Are you sure you want to delete "${category.category}"? All related items in this category will also be deleted.`,
                  );
                  if (confirmDelete) {
                    deleteCategory(category._id);
                  }
                }}
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

export default CategoryEditModal;
