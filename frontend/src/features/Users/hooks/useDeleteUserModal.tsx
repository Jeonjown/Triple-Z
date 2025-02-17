import { useState } from "react";
import { User } from "../pages/ManageUsers";
import useDeleteUser from "./useDeleteUser";

const useDeleteUserModal = () => {
  const { mutate, isPending, isError, error } = useDeleteUser();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = (userId: string) => {
    mutate({ userId });
    setDeleteModalOpen(false);
  };

  const handleCloseModal = () => {
    setDeleteModalOpen(false);
  };

  return {
    userToDelete,
    isDeleteModalOpen,
    handleConfirmDelete,
    handleCloseModal,
    setDeleteModalOpen,
    handleDelete,
    isPending,
    isError,
    error,
  };
};

export default useDeleteUserModal;
