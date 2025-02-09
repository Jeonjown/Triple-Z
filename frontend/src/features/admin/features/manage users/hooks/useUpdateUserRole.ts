import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRole } from "../../../../../api/user";
import { User } from "../pages/ManageUsers"; // Adjust import path as needed
import { useToast } from "@/hooks/use-toast";

// Define types for the parameters
interface UseUpdateUserRoleProps {
  setUserToEdit: (value: User) => void;
  setShowConfirmation: (value: boolean) => void;
  userToEdit: User;
}

const useUpdateUserRole = ({
  setUserToEdit,
  setShowConfirmation,
  userToEdit,
}: UseUpdateUserRoleProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: updateUserRole,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setUserToEdit({
        ...userToEdit,
        role: data.user.role,
      });
      setShowConfirmation(false);
      toast({
        description: "Role updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: "Error updating role.",
      });
      console.error("Error updating role:", error);
      setShowConfirmation(false);
    },
  });

  return { mutate, isPending, isError, error };
};

export default useUpdateUserRole;
