import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMenuItem, MenuItemData } from "../api/menu";
import { toast } from "@/hooks/use-toast";

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    MenuItemData, // Return type on success
    Error, // Error type
    MenuItemData // Input type
  >({
    mutationFn: (values: MenuItemData) => createMenuItem(values),
    onError: (err) => {
      console.error("Error creating menu item:", err);
      toast({
        title: "Error creating menu item",
        description:
          "There was an error creating the menu item. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      console.log("Menu item created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      toast({
        title: "Menu item created",
        description: "The menu item was created successfully.",
        variant: "default",
      });
    },
  });

  return { mutate, isPending, isError, error };
};
