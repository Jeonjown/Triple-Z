import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editCategory } from "../api/menu";
import { useState } from "react";
import { SingleCategory } from "../components/CategoryModal";
import { toast } from "@/hooks/use-toast";

export const useEditCategory = () => {
  const [showEditConfirmation, setShowEditConfirmation] =
    useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [inputEditValue, setInputEditValue] = useState("");
  const [categoryToEdit, setCategoryToEdit] = useState<
    SingleCategory | undefined
  >(undefined);

  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({
      categoryId,
      category,
    }: {
      categoryId: string;
      category: string;
    }) => {
      console.log("Mutation called with:", { categoryId, category });
      return editCategory(categoryId, category);
    },
    onError: (err) => {
      console.error("Error editing category:", err);
      toast({
        title: "Error editing category",
        description:
          "There was an error updating the category. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      console.log("Category edited successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Category updated",
        description: "Category has been updated successfully.",
        variant: "default",
      });
    },
  });

  const handleSaveEdit = () => {
    setEditMode(false);
    setShowEditConfirmation(true);
  };

  const handleEditCategory = (category: SingleCategory) => {
    setEditMode(true);
    setInputEditValue(category.category);
    setCategoryToEdit(category);
  };

  return {
    handleSaveEdit,
    handleEditCategory,
    showEditConfirmation,
    setShowEditConfirmation,
    mutate,
    editMode,
    setEditMode,
    inputEditValue,
    setInputEditValue,
    categoryToEdit,
    setCategoryToEdit,
    isPending,
    isError,
    error,
  };
};
