import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Category, createCategory } from "../manage menu/api/menu";
import { useState } from "react";

export const useCreateCategory = () => {
  const [isAddCategoryFormOpen, setIsAddCategoryFormOpen] =
    useState<boolean>(false);
  const [itemToAdd, setItemToAdd] = useState<string>("");

  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createCategory,
    onError: (err) => {
      console.error("Error creating category:", err);
    },
    onSuccess: (data) => {
      console.log("Category created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const handleAddCategory = () => {
    if (itemToAdd.trim() !== "") {
      const newCategory: Category = {
        category: itemToAdd,
        subcategories: [],
      };
      mutate(newCategory, {
        onSuccess: () => {
          setIsAddCategoryFormOpen(false);
          setItemToAdd("");
        },
      });
    } else {
      console.error("Category name cannot be empty!");
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
    handleAddCategory,
  };
};
