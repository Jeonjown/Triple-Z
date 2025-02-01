import { useMutation } from "@tanstack/react-query";
import { createMenuItem } from "../api/menu";

const useCreateMenuItem = () => {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createMenuItem,
    onError: (err) => {
      console.error("Error creating menu item:", err);
    },
    onSuccess: (data) => {
      console.log("Menu item created successfully:", data);
    },
  });

  return { mutate, isPending, isError, error };
};

export default useCreateMenuItem;
