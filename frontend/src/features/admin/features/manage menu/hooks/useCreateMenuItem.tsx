import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMenuItem, MenuItemData } from "../api/menu";

// Type the mutation hook explicitly
export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation<
    MenuItemData, // The type that is returned on success
    Error,
    MenuItemData
  >({
    mutationFn: (values: MenuItemData) => createMenuItem(values),
    onError: (err) => {
      console.error("Error creating menu item:", err);
    },
    onSuccess: (data) => {
      console.log("Menu item created successfully:", data);
      queryClient.invalidateQueries({
        queryKey: ["menuItems"],
      });
    },
  });

  return { mutate, isPending, isError, error };
};
