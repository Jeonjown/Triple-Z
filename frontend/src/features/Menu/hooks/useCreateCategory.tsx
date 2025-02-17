import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Category, createCategory } from "../api/menu";
import { toast } from "@/hooks/use-toast";

export const useCreateCategory = () => {
  const [isAddCategoryFormOpen, setIsAddCategoryFormOpen] =
    useState<boolean>(false);
  const [itemToAdd, setItemToAdd] = useState<string>("");

  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createCategory,
    onError: (err) => {
      console.error("Error creating category:", err);
      toast({
        title: "Error",
        description:
          "There was an error creating the category. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      console.log("Category created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Category created",
        description: "Your category has been created successfully.",
        variant: "default",
      });
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
      toast({
        title: "Empty Category Name",
        description: "Please enter a category name before saving.",
        variant: "destructive",
      });
      // Optionally, cancel add mode:
      setIsAddCategoryFormOpen(false);
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
