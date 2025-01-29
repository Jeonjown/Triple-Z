import { flexRender, Table } from "@tanstack/react-table";
import DeleteUserModal from "./DeleteUserModal";
import useDeleteUserModal from "../hooks/useDeleteUserModal";
import { User } from "../pages/ManageUsers";
import UserEditModal from "./UserEditModal";
import useEditUserModal from "../hooks/useEditUserModal";

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

  return (
    <>
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

      {/* Feedback for Deleting a User */}
      {isPending && (
        <div className="text-sm text-blue-500">
          Deleting user, please wait...
        </div>
      )}
      {isError && (
        <div className="text-sm text-red-700">
          Error: {error ? error.message : "An unexpected error occurred."}
        </div>
      )}

      <div className="grid w-5/6 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Data Rows Rendered as Cards */}
        {table.getRowModel().rows.map((row) => (
          // CARD
          <div
            key={row.id}
            className="flex min-w-0 flex-col space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-md transition hover:scale-105 hover:border-secondary hover:shadow-xl"
          >
            {/* Individual Cells as Key-Value Pairs */}
            {row.getVisibleCells().map((cell) => {
              // Find the matching header for this cell
              const header = table
                .getHeaderGroups()
                .flatMap((group) => group.headers)
                .find((h) => h.id === cell.column.id);

              return (
                <div
                  key={cell.id}
                  className="flex items-center justify-between text-gray-600"
                >
                  {/* Check if header exists */}
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="ml-1 mr-3 size-3"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.24 6.8a.75.75 0 0 0 1.06-.04l1.95-2.1v8.59a.75.75 0 0 0 1.5 0V4.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0L2.2 5.74a.75.75 0 0 0 .04 1.06Zm8 6.4a.75.75 0 0 0-.04 1.06l3.25 3.5a.75.75 0 0 0 1.1 0l3.25-3.5a.75.75 0 1 0-1.1-1.02l-1.95 2.1V6.75a.75.75 0 0 0-1.5 0v8.59l-1.95-2.1a.75.75 0 0 0-1.06-.04Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  )}
                  <span className="truncate text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </span>
                </div>
              );
            })}
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => handleEdit(row.original)}
                className="rounded bg-secondary px-3 py-2 text-white hover:opacity-85"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(row.original)}
                className="rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserCardView;
