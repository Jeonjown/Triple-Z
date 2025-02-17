import { useQueryClient, useMutation } from "@tanstack/react-query";
import { MenuItemData, editMenuItem } from "../api/menu";
import { FormValues } from "../components/CreateMenuItemModal";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { MenuItem } from "../pages/ManageMenu";

export const useEditMenuItem = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [itemToEdit, setItemToEdit] = useState<MenuItem | null>(null);

  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    MenuItemData, // Return type
    Error, // Error type
    FormValues // Input type
  >({
    mutationFn: (values: FormValues) => {
      if (!values._id) {
        console.error("Error: _id is missing from FormValues");
        throw new Error("Menu item _id is required for updating.");
      }

      // Convert FormValues to MenuItemData
      const menuItemData: MenuItemData = {
        category: values.category,
        subcategory: values.subcategory,
        item: {
          title: values.title,
          basePrice: values.basePrice,
          sizes: values.sizes,
          requiresSizeSelection: values.requiresSizeSelection,
          description: values.description,
          availability: values.availability,
        },
        image: values.image ?? null,
        _id: values._id,
      };

      return editMenuItem(menuItemData);
    },
    onError: (err) => {
      console.error("Error updating menu item:", err);
      toast({
        title: "Error updating menu item",
        description:
          "There was an error updating the menu item. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      console.log("Menu item updated successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      toast({
        title: "Menu item updated",
        description: "The menu item has been updated successfully.",
        variant: "default",
      });
    },
  });

  // Function to trigger edit mode and set the item to be edited
  const handleEdit = (menuItem: MenuItem) => {
    setEditMode(true);
    setItemToEdit(menuItem);
  };

  return {
    mutate,
    isPending,
    isError,
    error,
    editMode,
    setEditMode,
    itemToEdit,
    setItemToEdit,
    handleEdit,
  };
};
