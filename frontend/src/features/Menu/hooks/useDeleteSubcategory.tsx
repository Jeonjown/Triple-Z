import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSubcategory } from "../api/menu";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export const useDeleteSubcategory = () => {
  const queryClient = useQueryClient();
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    _id: string;
    subcategory: string;
  } | null>(null);
  const [message] = useState<string>("All related items will also be lost.");

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({
      categoryId,
      subcategoryId,
    }: {
      categoryId: string;
      subcategoryId: string;
    }) => deleteSubcategory(categoryId, subcategoryId),
    onError: (err) => {
      console.error("Error deleting subcategory:", err);
      toast({
        title: "Error deleting subcategory",
        description:
          "There was an error deleting the subcategory. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      console.log("Subcategory deleted successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      toast({
        title: "Subcategory deleted",
        description: "The subcategory has been successfully deleted.",
        variant: "default",
      });
      setDeleteTarget(null);
    },
  });

  const handleDelete = (subcategory: { _id: string; subcategory: string }) => {
    setDeleteTarget(subcategory);
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
