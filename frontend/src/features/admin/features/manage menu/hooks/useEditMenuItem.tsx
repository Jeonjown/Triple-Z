import { useQueryClient, useMutation } from "@tanstack/react-query";
import { MenuItemData, editMenuItem } from "../api/menu";
import { FormValues } from "../components/CreateMenuItemModal";
import { useState } from "react";
import { MenuItem } from "../pages/ManageMenu";

export const useEditMenuItem = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [itemToEdit, setItemToEdit] = useState<MenuItem | null>(null);

  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    MenuItemData, // Return type is MenuItemData
    Error, // Error type is Error
    FormValues // Accept FormValues as input type
  >({
    mutationFn: (values: FormValues) => {
      // Ensure _id is provided for update
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
        _id: values._id, // Ensure _id is included for the update
      };

      return editMenuItem(menuItemData); // Call the function with the converted data
    },
    onError: (err) => {
      console.error("Error updating menu item:", err);
    },
    onSuccess: (data) => {
      console.log("Menu item updated successfully:", data);
      queryClient.invalidateQueries({
        queryKey: ["menuItems"],
      });
    },
  });

  // Placeholder function for handling edits
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
