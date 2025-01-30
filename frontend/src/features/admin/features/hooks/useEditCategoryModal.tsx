import { useState } from "react";

export interface CategoryData {
  data: { category: string; _id: string }[];
}

const useEditCategoryModal = () => {
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryData | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleEdit = (data: CategoryData) => {
    setIsEditModalOpen(true);
    setCategoryToEdit(data);
  };
  return {
    handleEdit,
    categoryToEdit,
    setCategoryToEdit,
    isEditModalOpen,
    setIsEditModalOpen,
    showConfirmation,
    setShowConfirmation,
  };
};

export default useEditCategoryModal;
