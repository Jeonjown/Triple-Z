import { flexRender, Table } from "@tanstack/react-table";
import DeleteUserModal from "./DeleteUserModal";
import useDeleteUserModal from "../hooks/useDeleteUserModal";
import { User } from "../pages/ManageUsers";
import UserEditModal from "./UserEditModal";
import useEditUserModal from "../hooks/useEditUserModal";
import { SquarePen, Trash2, Eye } from "lucide-react";
import useAuthStore from "@/features/Auth/stores/useAuthStore";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import LoadingPage from "@/pages/LoadingPage";
import ErrorPage from "@/pages/ErrorPage";
import UserViewTransactionModal from "./UserViewTransactionModal";
import { useState } from "react";

interface UserCardViewProps {
  table: Table<User>;
}

const UserCardView = ({ table }: UserCardViewProps) => {
  const {
    handleEdit,
    userToEdit,
    setUserToEdit,
    isEditModalOpen,
    setIsEditModalOpen,
  } = useEditUserModal();

  const {
    isDeleteModalOpen,
    userToDelete,
    handleDelete,
    handleConfirmDelete,
    handleCloseModal,
    isPending: isDeletePending,
    isError: isDeleteError,
    error: deleteError,
  } = useDeleteUserModal();

  const { user: currentUser } = useAuthStore();

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleViewTransactions = (userId: string) => {
    setSelectedUserId(userId);
    setIsTransactionModalOpen(true);
  };

  const handleCloseTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setSelectedUserId(null);
  };

  if (isDeletePending) {
    return <LoadingPage />;
  }

  if (isDeleteError) {
    return (
      <ErrorPage
        message={deleteError?.message}
        statusCode={deleteError?.statusCode}
      />
    );
  }

  return (
    <>
      {/* Modal Overlays */}
      {isEditModalOpen && userToEdit && (
        <UserEditModal
          setIsEditModalOpen={setIsEditModalOpen}
          userToEdit={userToEdit}
          setUserToEdit={setUserToEdit}
        />
      )}
      {isDeleteModalOpen && userToDelete && (
        <DeleteUserModal
          user={userToDelete}
          handleConfirmDelete={handleConfirmDelete}
          handleCloseModal={handleCloseModal}
        />
      )}

      {/* Transaction Modal */}
      {isTransactionModalOpen && selectedUserId && (
        <UserViewTransactionModal
          userId={selectedUserId}
          onClose={handleCloseTransactionModal}
        />
      )}

      {/* Main Content – Cards */}
      <div className="grid w-5/6 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {table.getRowModel().rows.map((row) => {
          const user = row.original;
          const isSelf = user._id === currentUser?._id;

          return (
            <div
              key={row.id}
              className="relative flex min-w-0 flex-col space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-md transition hover:scale-105 hover:border-secondary hover:shadow-xl"
            >
              {/* User Details */}
              <div className="space-y-2 pb-20">
                {row.getVisibleCells().map((cell) => {
                  const header = table
                    .getHeaderGroups()
                    .flatMap((group) => group.headers)
                    .find((h) => h.id === cell.column.id);

                  return (
                    <div
                      key={cell.id}
                      className="flex items-center justify-between text-gray-600"
                    >
                      {header &&
                        header?.column.columnDef.header !== "Actions" && (
                          <span className="text-sm font-medium">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </span>
                        )}
                      <span className="truncate text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <Button
                  onClick={() => handleViewTransactions(user._id)}
                  size="icon"
                  className="bg-blue-500"
                >
                  <Eye size={20} />
                </Button>
                <Button onClick={() => handleEdit(user)} size="icon">
                  <SquarePen size={20} />
                </Button>

                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          onClick={() => handleDelete(user)}
                          size="icon"
                          variant="destructive"
                          className="disabled:cursor-not-allowed disabled:bg-secondary"
                          disabled={isSelf}
                        >
                          <Trash2 size={20} />
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {isSelf && (
                      <TooltipContent side="bottom">
                        <p>You cannot delete yourself.</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                {/* Eye Icon to View Transactions */}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default UserCardView;
