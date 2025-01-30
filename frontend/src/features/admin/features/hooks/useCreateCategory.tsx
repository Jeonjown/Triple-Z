import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../manage menu/api/menu";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createCategory,
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
