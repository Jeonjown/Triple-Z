import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "../api/menu";
import { useState } from "react";

// Custom hook for deleting a category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    _id: string;
    category: string;
  } | null>(null); // Store the target category
  const [message] = useState<string>("All  related items  will also be lost.");
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: deleteCategory,
    onError: (err) => {
      console.error("Error deleting category:", err);
    },
    onSuccess: (data) => {
      console.log("Category deleted successfully:", data);
      queryClient.invalidateQueries({
        queryKey: ["categories"], // Invalidate the categories cache
      });

      queryClient.invalidateQueries({
        queryKey: ["menuItems"], // Invalidate the categories cache
      });

      if (deleteTarget?._id) {
        queryClient.invalidateQueries({
          queryKey: ["subcategories", deleteTarget._id],
        });
      }
      setDeleteTarget(null); // Clear the target after successful deletion
    },
  });

  const handleDelete = (category: { _id: string; category: string }) => {
    setDeleteTarget(category); // Set the category to be deleted
    setShowConfirmation(true); // Show confirmation modal
  };

  return {
    mutate,
    isPending,
    isError,
    error,
    showConfirmation,
    setShowConfirmation,
    message,
    deleteTarget, // Provide the target category info for the modal
    handleDelete, // Provide the function to initiate delete
  };
};
