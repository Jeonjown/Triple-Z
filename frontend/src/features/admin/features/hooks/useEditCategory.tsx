import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editCategory } from "../manage menu/api/menu";

export const useEditCategory = () => {
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
    },
    onSuccess: (data) => {
      console.log("Category edited successfully:", data);
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  return {
    mutate,
    isPending,
    isError,
    error,
  };
};
