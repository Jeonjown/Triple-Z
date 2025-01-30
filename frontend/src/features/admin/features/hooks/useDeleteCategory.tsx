import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "../manage menu/api/menu";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: deleteCategory,
    onError: (err) => {
      console.error("Error creating category:", err);
    },
    onSuccess: (data) => {
      console.log("Category created successfully:", data);
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  return { mutate, isPending, isError, error };
};
