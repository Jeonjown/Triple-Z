import { useState } from "react";

export interface CategoryData {
  data: { category: string; _id: string }[];
}

const useCategoryModal = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  return {
    isEditModalOpen,
    setIsEditModalOpen,
    showConfirmation,
    setShowConfirmation,
  };
};

export default useCategoryModal;
