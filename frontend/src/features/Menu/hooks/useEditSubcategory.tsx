import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editSubcategory } from "../api/menu";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface Subcategory {
  _id: string;
  subcategory: string;
}

export const useEditSubcategory = () => {
  const [showEditConfirmation, setShowEditConfirmation] =
    useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [inputEditValue, setInputEditValue] = useState("");
  const [subcategoryToEdit, setSubcategoryToEdit] = useState<
    Subcategory | undefined
  >(undefined);

  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({
      categoryId,
      subcategoryId,
      subcategoryName,
    }: {
      categoryId: string;
      subcategoryId: string;
      subcategoryName: string;
    }) => {
      console.log("Mutation called with:", {
        categoryId,
        subcategoryId,
        subcategoryName,
      });
      return editSubcategory(categoryId, subcategoryId, subcategoryName);
    },
    onError: (err) => {
      console.error("Error editing subcategory:", err);
      toast({
        title: "Error editing subcategory",
        description:
          "There was an error updating the subcategory. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      console.log("Subcategory edited successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      toast({
        title: "Subcategory updated",
        description: "The subcategory has been updated successfully.",
        variant: "default",
      });
    },
  });

  const handleSaveEdit = () => {
    setEditMode(false);
    setShowEditConfirmation(true);
  };

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setEditMode(true);
    setInputEditValue(subcategory.subcategory);
    setSubcategoryToEdit(subcategory);
  };

  return {
    handleSaveEdit,
    handleEditSubcategory,
    showEditConfirmation,
    setShowEditConfirmation,
    mutate,
    editMode,
    setEditMode,
    inputEditValue,
    setInputEditValue,
    subcategoryToEdit,
    setSubcategoryToEdit,
    isPending,
    isError,
    error,
  };
};
