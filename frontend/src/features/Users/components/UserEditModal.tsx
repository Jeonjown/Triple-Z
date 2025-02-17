import { User } from "../pages/ManageUsers";

import { Button } from "@/components/ui/button";
import useEditUserModal from "../hooks/useEditUserModal";
import useUpdateUserRole from "../hooks/useUpdateUserRole";

import { UserMinus, UserPlus, X } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useAuthStore from "@/features/Auth/stores/useAuthStore";
import { formatCreatedAt } from "@/utils/dateUtils";

interface UserEditModalProps {
  setIsEditModalOpen: (value: boolean) => void;
  setUserToEdit: (value: User) => void;
  userToEdit: User;
}

const UserEditModal = ({
  setIsEditModalOpen,
  userToEdit,
  setUserToEdit,
}: UserEditModalProps) => {
  const {
    showConfirmation,
    setShowConfirmation,
    roleToUpdate,
    setRoleToUpdate,
  } = useEditUserModal();
  const { mutate, isPending, isError, error } = useUpdateUserRole({
    setUserToEdit,
    setShowConfirmation,
    userToEdit,
  });
  const { user } = useAuthStore();

  if (isPending) return <span>Loading...</span>;
  if (isError)
    return (
      <span className="text-sm text-red-700">
        Error: {error?.message || "Unknown error"}
      </span>
    );

  const isSelf = user?._id === userToEdit._id;
  const newRole = userToEdit.role === "user" ? "admin" : "user";
  const tooltipText = isSelf
    ? "Cannot change your own role"
    : newRole === "admin"
      ? "Promote to Admin"
      : "Demote to User";

  const handleRoleUpdate = () => {
    if (!isSelf) {
      setRoleToUpdate(newRole);
      setShowConfirmation(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative m-4 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {/* Close Button */}

        <Button
          size={"icon"}
          variant={"ghost"}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          onClick={() => setIsEditModalOpen(false)}
        >
          <X />
        </Button>

        <h2 className="mb-6 text-xl font-semibold text-gray-800">Edit User</h2>

        <div className="space-y-4">
          {["_id", "Username", "Email"].map((field) => (
            <div key={field} className="flex justify-between">
              <label className="text-gray-700">{field}:</label>
              <span className="text-gray-500">
                {userToEdit[field.toLowerCase() as keyof User]}
              </span>
            </div>
          ))}

          <div className="flex justify-between">
            <label className="text-gray-700">Role:</label>
            <div className="flex items-center space-x-2">
              <span className="text-text">{userToEdit.role}</span>
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        size="icon"
                        onClick={handleRoleUpdate}
                        disabled={isSelf}
                        className={`rounded p-1 transition-all hover:scale-110 hover:opacity-85 ${
                          isSelf ? "cursor-not-allowed opacity-80" : ""
                        }`}
                      >
                        {newRole === "admin" ? <UserPlus /> : <UserMinus />}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{tooltipText}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="flex justify-between">
            <label className="text-gray-700">Created At:</label>
            <span className="text-gray-500">
              {formatCreatedAt(userToEdit.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              {roleToUpdate === "admin" ? "promote" : "demote"} this user?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => mutate({ userId: userToEdit._id, roleToUpdate })}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserEditModal;
