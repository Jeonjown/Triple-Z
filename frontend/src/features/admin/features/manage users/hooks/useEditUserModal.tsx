import { useState } from "react";
import { User } from "../pages/ManageUsers";

const useEditUserModal = () => {
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [roleToUpdate, setRoleToUpdate] = useState("");

  const handleEdit = (user: User) => {
    setIsEditModalOpen(true);
    setUserToEdit(user);
  };
  return {
    handleEdit,
    userToEdit,
    setUserToEdit,
    isEditModalOpen,
    setIsEditModalOpen,
    showConfirmation,
    setShowConfirmation,
    roleToUpdate,
    setRoleToUpdate,
  };
};

export default useEditUserModal;
