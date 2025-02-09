import { flexRender, Table } from "@tanstack/react-table";
import DeleteUserModal from "./DeleteUserModal";
import useDeleteUserModal from "../hooks/useDeleteUserModal";
import { User } from "../pages/ManageUsers";
import UserEditModal from "./UserEditModal";
import useEditUserModal from "../hooks/useEditUserModal";
import { ArrowUpDown, SquarePen, Trash2 } from "lucide-react";
import useAuthStore from "@/features/auth/stores/useAuthStore";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import LoadingPage from "@/pages/LoadingPage";
import ErrorPage from "@/pages/ErrorPage";

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
    isPending,
    isError,
    error,
  } = useDeleteUserModal();

  const { user: currentUser } = useAuthStore();

  if (isPending) {
    return <LoadingPage />;
  }

  if (isError && error?.statusCode !== 404) {
    return (
      <ErrorPage message={error?.message} statusCode={error?.statusCode} />
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

      {/* Main Content – Cards */}
      <div className="grid w-5/6 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {table.getRowModel().rows.map((row) => {
          const isSelf = row.original._id === currentUser?._id;

          return (
            <div
              key={row.id}
              className="flex min-w-0 flex-col space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-md transition hover:scale-105 hover:border-secondary hover:shadow-xl"
            >
              {/* Render each cell as a key-value pair */}
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
                    {header && (
                      <div
                        className="flex items-center hover:scale-110 hover:cursor-pointer hover:opacity-80"
                        onClick={header.column.getToggleSortingHandler?.()}
                      >
                        {header?.column.columnDef.header !== "Actions" && (
                          <span className="text-sm font-medium">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </span>
                        )}
                        {header.column.columnDef.header === "Actions" ? (
                          ""
                        ) : (
                          <ArrowUpDown className="ml-1 mr-3 size-3" />
                        )}
                      </div>
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

              {/* Action Buttons */}
              <div className="ml-auto flex gap-2">
                <Button onClick={() => handleEdit(row.original)} size="icon">
                  <SquarePen size={20} />
                </Button>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          onClick={() => handleDelete(row.original)}
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
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default UserCardView;
