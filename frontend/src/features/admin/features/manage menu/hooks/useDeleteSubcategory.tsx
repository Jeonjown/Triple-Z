import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSubcategory } from "../api/menu"; // Make sure to import the correct function
import { useState } from "react";

// Custom hook for deleting a subcategory
export const useDeleteSubcategory = () => {
  const queryClient = useQueryClient();
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    _id: string;
    subcategory: string;
  } | null>(null); // Store the target subcategory
  const [message] = useState<string>("All related items will also be lost.");

  // Correcting the mutate function to pass a function reference to deleteSubcategory
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({
      categoryId,
      subcategoryId,
    }: {
      categoryId: string;
      subcategoryId: string;
    }) => deleteSubcategory(categoryId, subcategoryId), // Pass arguments to deleteSubcategory
    onError: (err) => {
      console.error("Error deleting subcategory:", err);
    },
    onSuccess: (data) => {
      console.log("Subcategory deleted successfully:", data);
      queryClient.invalidateQueries({
        queryKey: ["subcategories"], // Invalidate subcategories cache
      });
      setDeleteTarget(null); // Clear the target after successful deletion
    },
  });

  const handleDelete = (subcategory: { _id: string; subcategory: string }) => {
    setDeleteTarget(subcategory); // Set the subcategory to be deleted
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
    deleteTarget,
    handleDelete,
  };
};
