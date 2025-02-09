import { flexRender, Table as TanstackTable } from "@tanstack/react-table";
import { User } from "../pages/ManageUsers";
import useDeleteUserModal from "../hooks/useDeleteUserModal";
import useEditUserModal from "../hooks/useEditUserModal";
import UserEditModal from "./UserEditModal";
import useAuthStore from "@/features/auth/stores/useAuthStore";
import { SquarePen, Trash2, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// Import your ShadCN table components
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import DeleteUserModal from "./DeleteUserModal";

interface UserTableViewProps {
  table: TanstackTable<User>;
}

const UserTableView = ({ table }: UserTableViewProps) => {
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

      <div className="mx-auto w-5/6 flex-col rounded-lg">
        <div className="rounded-lg bg-white shadow-md">
          <Table>
            <TableHeader className="bg-primary">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={` ${header.column.id === "_id" ? "hidden xl:table-cell" : ""} ${header.column.id === "role" ? "hidden sm:table-cell md:table-cell" : ""} ${header.column.id === "email" ? "hidden lg:table-cell" : ""} ${header.column.id === "username" || header.column.id === "actions" ? "sm:table-cell" : ""} ${(header.column.id === "role" || header.column.id === "email") && "lg:table-cell"} px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white`}
                    >
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none flex items-center"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanSort() && (
                          <ArrowUpDown className="ml-1 mr-3 size-3" />
                        )}
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="bg-primary px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                    Actions
                  </TableHead>
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="divide-y divide-gray-200 bg-white">
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="transition hover:border-2 hover:bg-gray-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={` ${cell.column.id === "_id" ? "hidden xl:table-cell" : ""} ${cell.column.id === "role" ? "hidden sm:table-cell md:table-cell" : ""} ${cell.column.id === "email" ? "hidden lg:table-cell" : ""} ${cell.column.id === "username" || cell.column.id === "actions" ? "sm:table-cell" : ""} ${(cell.column.id === "role" || cell.column.id === "email") && "lg:table-cell"} whitespace-nowrap px-6 py-4 text-sm text-text`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="mt-1 flex items-center gap-2 py-4">
                    <Button
                      onClick={() => handleEdit(row.original)}
                      size="icon"
                    >
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
                              disabled={row.original._id === currentUser?._id}
                            >
                              <Trash2 size={20} />
                            </Button>
                          </span>
                        </TooltipTrigger>
                        {row.original._id === currentUser?._id && (
                          <TooltipContent side="bottom">
                            <p>You cannot delete yourself.</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default UserTableView;
