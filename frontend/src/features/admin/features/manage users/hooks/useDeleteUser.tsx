import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../../../../../api/user";
import { CustomError } from "types";
import { toast } from "@/hooks/use-toast";

// Define the expected variables type for the deleteUser function.
interface DeleteUserVariables {
  userId: string;
}

const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    void, // The mutation function returns void (update if needed)
    CustomError, // Use your custom error type
    DeleteUserVariables // The variables expected by deleteUser
  >({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      console.log("Deleted User successfully.");
      toast({
        title: "User Deleted",
        description: "User has been successfully deleted.",
      });
    },
    onError: (error: CustomError) => {
      console.error("Error deleting user:", error);
      toast({
        title: "Error Deleting User",
        description:
          error.message || "An error occurred while deleting the user.",
        variant: "destructive",
      });
    },
  });

  // Alias `isLoading` as `isPending` to match your UI naming conventions.
  return { mutate, isPending, isError, error };
};

export default useDeleteUser;
