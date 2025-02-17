import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "../api/menu";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    _id: string;
    category: string;
  } | null>(null);
  const [message] = useState<string>("All related items will also be lost.");

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: deleteCategory,
    onError: (err) => {
      console.error("Error deleting category:", err);
      toast({
        title: "Error deleting category",
        description:
          "There was an error deleting the category. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      console.log("Category deleted successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      if (deleteTarget?._id) {
        queryClient.invalidateQueries({
          queryKey: ["subcategories", deleteTarget._id],
        });
      }
      toast({
        title: "Category Deleted",
        description: "The category has been successfully deleted.",
        variant: "default",
      });
      setDeleteTarget(null);
    },
  });

  const handleDelete = (category: { _id: string; category: string }) => {
    setDeleteTarget(category);
    setShowConfirmation(true);
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
