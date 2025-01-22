import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRole } from "../../../api/user";
import { formatCreatedAt } from "../../../utils/dateUtils";
import { useState } from "react"; // import useState
import useAuthStore from "../../auth/stores/useAuthStore";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  actions?: JSX.Element;
}

interface EditModalProps {
  setEditMode: (value: boolean) => void;
  setUserToEdit: (value: User) => void;
  userToEdit: User;
}

const EditModal = ({
  setEditMode,
  userToEdit,
  setUserToEdit,
}: EditModalProps) => {
  const queryClient = useQueryClient();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [roleToUpdate, setRoleToUpdate] = useState("");

  const { user } = useAuthStore();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: updateUserRole,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setUserToEdit({
        ...userToEdit,
        role: data.user.role,
      });
      setShowConfirmation(false); // Hide confirmation after successful update
    },
    onError: (error) => {
      console.error("Error updating role:", error);
      setShowConfirmation(false); // Hide confirmation if there's an error
    },
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span className="text-sm text-red-700">Error: {error.message}</span>;
  }

  const handleRoleUpdate = (currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    setRoleToUpdate(newRole);
    setShowConfirmation(true);
  };

  const confirmRoleUpdate = () => {
    mutate({ userId: userToEdit._id, roleToUpdate });
  };

  const cancelRoleUpdate = () => {
    setShowConfirmation(false); // Cancel the confirmation
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {/* Close Button */}
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          onClick={() => setEditMode(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="mb-6 text-xl font-semibold text-gray-800">Edit User</h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <label className="text-gray-700">ID:</label>
            <span className="text-gray-500">{userToEdit._id}</span>
          </div>

          <div className="flex justify-between">
            <label className="text-gray-700">Username:</label>
            <span className="text-gray-500">{userToEdit.username}</span>
          </div>

          <div className="flex justify-between">
            <label className="text-gray-700">Email:</label>
            <span className="text-gray-500">{userToEdit.email}</span>
          </div>

          <div className="flex justify-between">
            <label className="text-gray-700">Role:</label>
            <div className="flex items-center space-x-2">
              <span className="text-text">{userToEdit.role}</span>
              <div className="group relative">
                {userToEdit.role === "user" ? (
                  <div className="group relative">
                    <button
                      disabled={user?._id === userToEdit._id}
                      className="rounded bg-secondary p-1 transition-all hover:scale-110 hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-80"
                      onClick={() => handleRoleUpdate(userToEdit.role)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                        />
                      </svg>
                    </button>
                    {/* Tooltip */}
                    <div className="absolute left-1/2 top-full z-10 mb-2 mt-2 hidden w-max -translate-x-1/2 rounded border bg-primary px-2 py-1 text-xs opacity-0 shadow-sm group-hover:block group-hover:opacity-100">
                      {userToEdit.role === "user"
                        ? "Promote to Admin"
                        : "Demote to User"}
                    </div>
                  </div>
                ) : (
                  // DEMOTE USER
                  <div className="group relative">
                    <button
                      disabled={user?._id === userToEdit._id}
                      className="rounded bg-secondary p-1 transition-all hover:scale-110 hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-80"
                      onClick={() => handleRoleUpdate(userToEdit.role)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                        />
                      </svg>
                    </button>
                    {/* Tooltip */}
                    <div className="absolute left-1/2 top-full z-10 mb-2 mt-2 hidden w-max -translate-x-1/2 rounded border bg-primary px-2 py-1 text-xs opacity-0 shadow-sm group-hover:block group-hover:opacity-100">
                      {user?._id === userToEdit._id
                        ? "Cannot demote self"
                        : userToEdit.role === "user"
                          ? "Promote to Admin"
                          : "Demote to User"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <label className="text-gray-700">Created At:</label>
            <span className="text-gray-500">
              {formatCreatedAt(userToEdit.createdAt)}
            </span>
          </div>
        </div>

        {/* <button
          className="mt-6 w-full rounded bg-secondary px-4 py-2 text-white transition-all hover:opacity-85"
          onClick={() => setEditMode(false)}
        >
          Save Changes
        </button> */}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="z-60 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-3/6 max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl">Confirm Role Change</h2>
            <p>
              Are you sure you want to {""}
              {roleToUpdate === "admin" ? "promote" : "demote"} this user?
            </p>
            <div className="mt-4 flex justify-between">
              <button
                className="rounded bg-red-600 px-4 py-2 text-white hover:opacity-85"
                onClick={cancelRoleUpdate}
              >
                Cancel
              </button>
              <button
                className="rounded bg-secondary px-4 py-2 text-white hover:opacity-85"
                onClick={confirmRoleUpdate}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditModal;
