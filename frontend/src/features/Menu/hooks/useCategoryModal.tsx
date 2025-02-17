import { useState } from "react";

export interface CategoryData {
  data: { category: string; _id: string }[];
}

const useCategoryModal = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  return {
    isEditModalOpen,
    setIsEditModalOpen,
  };
};

export default useCategoryModal;
