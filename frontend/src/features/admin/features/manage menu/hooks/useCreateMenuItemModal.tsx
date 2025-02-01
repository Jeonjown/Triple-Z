import { useState } from "react";
import { MenuItem } from "../pages/ManageMenu";

const useCreateMenuItemModal = () => {
  const [itemToAdd, setItemToAdd] = useState<MenuItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemData, setItemData] = useState({});

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };
  return {
    handleCreate,
    itemToAdd,
    setItemToAdd,
    isCreateModalOpen,
    setIsCreateModalOpen,
    showConfirmation,
    setShowConfirmation,
    setItemData,
    itemData,
  };
};

export default useCreateMenuItemModal;
