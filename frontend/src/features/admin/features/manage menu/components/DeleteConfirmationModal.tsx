interface DeleteConfirmationModalProps {
  showConfirmation: boolean;
  setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  target: string;
  children?: React.ReactNode;
  action: () => void;
}

const DeleteConfirmationModal = ({
  showConfirmation,
  setShowConfirmation,
  target,
  children,
  action,
}: DeleteConfirmationModalProps) => {
  if (!showConfirmation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-5/6 max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Confirm Deletion</h2>
        <p>Are you sure you want to delete "{target}"?</p>
        <span>{children}</span>

        <div className="mt-4 flex justify-between">
          <button
            className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
            onClick={() => setShowConfirmation(false)}
          >
            Cancel
          </button>
          <button
            className="rounded bg-red-600 px-4 py-2 text-white hover:opacity-85"
            onClick={() => {
              setShowConfirmation(false);
              action();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
