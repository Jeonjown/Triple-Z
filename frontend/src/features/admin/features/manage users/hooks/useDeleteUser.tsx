import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../../../../../api/user";

const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      console.log("deleted User:", data);
    },
    onError: (error) => {
      console.error("Error updating role:", error);
    },
  });

  return { mutate, isPending, isError, error };
};

export default useDeleteUser;
