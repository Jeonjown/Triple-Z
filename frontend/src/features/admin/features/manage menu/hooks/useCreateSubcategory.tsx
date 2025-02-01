import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createSubcategory } from "../api/menu";

interface Subcategory {
  categoryId: string;
  subcategoryName: string;
}

export const useCreateSubcategory = () => {
  const [isAddCategoryFormOpen, setIsAddCategoryFormOpen] =
    useState<boolean>(false);
  const [itemToAdd, setItemToAdd] = useState<string>("");

  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({ categoryId, subcategoryName }: Subcategory) => {
      console.log("Mutation called with:", {
        categoryId,
        subcategoryName,
      });
      return createSubcategory(categoryId, subcategoryName);
    },
    onError: (err) => {
      console.error("Error editing category:", err);
    },
    onSuccess: (data) => {
      console.log("Category edited successfully:", data);
      queryClient.invalidateQueries({
        queryKey: ["subcategories"],
      });
    },
  });

  const handleAddSubCategory = (currentCategory: string) => {
    if (itemToAdd.trim() !== "") {
      const newSubcategory: Subcategory = {
        categoryId: currentCategory,
        subcategoryName: itemToAdd,
      };

      mutate(newSubcategory);
      setIsAddCategoryFormOpen(false);
      setItemToAdd("");
    } else {
      console.error("Subcategory name cannot be empty!");
    }
  };

  return {
    mutate,
    isPending,
    isError,
    error,
    isAddCategoryFormOpen,
    setIsAddCategoryFormOpen,
    itemToAdd,
    setItemToAdd,
    handleAddSubCategory,
  };
};
