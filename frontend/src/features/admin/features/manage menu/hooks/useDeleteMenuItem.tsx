import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMenuItem } from "../api/menu";
import { useState } from "react";
import { MenuItem } from "../pages/ManageMenu";
import { toast } from "@/hooks/use-toast";

export const useDeleteMenuItem = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [target, setTarget] = useState<string>("");
  const [menuTitle, setMenuTitle] = useState<string | null>("");

  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: deleteMenuItem,
    onError: (err) => {
      console.error("Error deleting menu item:", err);
      toast({
        title: "Error deleting menu item",
        description:
          "There was an error deleting the menu item. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      console.log("Menu item deleted successfully:");
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      toast({
        title: "Menu item deleted",
        description: "The menu item has been successfully deleted.",
        variant: "default",
      });
    },
  });

  const handleDelete = (menuItem: MenuItem) => {
    if (menuItem._id) {
      setMenuTitle(menuItem.title); // Set the title of the item being deleted
      setTarget(menuItem._id); // Set the target ID for deletion
      setShowConfirmation(true); // Show the confirmation modal
    }
  };

  const handleConfirmDelete = () => {
    if (target) {
      mutate(target);
      setShowConfirmation(false);
    }
  };

  return {
    mutate,
    isPending,
    isError,
    error,
    handleDelete,
    menuTitle,
    target,
    showConfirmation,
    handleConfirmDelete,
    setShowConfirmation,
  };
};
