import { useState } from "react";

const useSubcategoryModal = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return {
    isModalOpen,
    setIsModalOpen,
  };
};

export default useSubcategoryModal;
