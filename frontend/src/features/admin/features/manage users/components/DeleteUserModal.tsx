import { User } from "../pages/ManageUsers";

interface DeleteUserModalProps {
  user: User | null;
  handleConfirmDelete: (value: string) => void;
  handleCloseModal: () => void;
}

const DeleteUserModal = ({
  user,
  handleConfirmDelete,
  handleCloseModal,
}: DeleteUserModalProps) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-5/6 max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl">Confirm Deletion</h2>
        <p>
          Are you sure you want to delete this user:{" "}
          <strong>{user.username}</strong>?
        </p>
        <div className="mt-4 flex justify-between">
          <button
            className="rounded bg-secondary px-4 py-2 text-white hover:opacity-85"
            onClick={handleCloseModal} // Close the modal without deleting
          >
            Cancel
          </button>
          <button
            className="rounded bg-red-600 px-4 py-2 text-white hover:opacity-85"
            onClick={() => handleConfirmDelete(user._id)} // Proceed with deletion
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
