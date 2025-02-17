import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createSubcategory } from "../api/menu";
import { toast } from "@/hooks/use-toast";

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
      console.log("Mutation called with:", { categoryId, subcategoryName });
      return createSubcategory(categoryId, subcategoryName);
    },
    onError: (err) => {
      console.error("Error creating subcategory:", err);
      toast({
        title: "Error creating subcategory",
        description:
          "There was an error creating the subcategory. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      console.log("Subcategory created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      toast({
        title: "Subcategory Created",
        description: "The subcategory has been successfully created.",
        variant: "default",
      });
    },
  });

  const handleAddSubCategory = (currentCategory: string) => {
    if (itemToAdd.trim() !== "") {
      const newSubcategory: Subcategory = {
        categoryId: currentCategory,
        subcategoryName: itemToAdd,
      };

      mutate(newSubcategory, {
        onSuccess: () => {
          setIsAddCategoryFormOpen(false);
          setItemToAdd("");
        },
      });
    } else {
      console.error("Subcategory name cannot be empty!");
      toast({
        title: "Empty Subcategory",
        description: "Please enter a subcategory name before saving.",
        variant: "destructive",
      });
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
    handleAddSubCategory,
  };
};
