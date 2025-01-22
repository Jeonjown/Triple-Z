// import { useQuery } from "@tanstack/react-query";
// import { getAllUsers } from "../api/admin";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
// import mockUsers from "../../../testing/users.json";
import { useState } from "react";
import CardView from "../components/CardView";
import ControlPanel from "../components/ControlPanel";
import TableView from "../components/TableView";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers } from "../api/admin";
import EditModal from "../components/EditModal";
import { deleteUser } from "../../../api/user";
import DeleteModal from "../components/DeleteModal";

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  actions?: JSX.Element;
}

const ManageUsers = () => {
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [view, setView] = useState<string | undefined>("card");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string | undefined>("");
  // const [data] = useState(mockUsers);
  const queryClient = useQueryClient();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const { mutate } = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      console.log("deleted User:", data);
    },
    onError: (error) => {
      console.error("Error updating role:", error);
    },
  });
  const handleEdit = (user: User) => {
    setEditMode(true);
    setUserToEdit(user);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = (userId: string) => {
    mutate({ userId });
    setDeleteModalOpen(false);
  };

  const handleCloseModal = () => {
    setDeleteModalOpen(false);
  };

  const columnHelper = createColumnHelper<User>();

  const columns = [
    columnHelper.accessor("_id", {
      cell: (info) => info.getValue(),
      header: () => (
        <span className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mr-1 size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
            />
          </svg>
          ID
        </span>
      ),
    }),
    columnHelper.accessor("username", {
      cell: (info) => info.getValue(),
      header: () => (
        <span className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mr-1 size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
          Username
        </span>
      ),
    }),
    columnHelper.accessor("email", {
      cell: (info) => (
        <span className="italic text-blue-600">{info.getValue()}</span>
      ),
      header: () => (
        <span className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mr-1 size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>
          Email
        </span>
      ),
    }),
    columnHelper.accessor("role", {
      cell: (info) => info.getValue(),
      header: () => (
        <span className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mr-1 size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
            />
          </svg>
          Role
        </span>
      ),
    }),
    columnHelper.accessor("actions", {
      cell: ({ row }) => (
        <div className="flex gap-2">
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
      ),
      enableSorting: false,
      header: "Actions",
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    getCoreRowModel: getCoreRowModel(),

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),

    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <>
      {isDeleteModalOpen && userToDelete && (
        <DeleteModal
          user={userToDelete}
          onDelete={handleConfirmDelete}
          onClose={handleCloseModal}
        />
      )}

      {editMode && userToEdit && (
        <EditModal
          setEditMode={setEditMode}
          userToEdit={userToEdit}
          setUserToEdit={setUserToEdit}
        />
      )}
      <div className="flex flex-col items-center justify-center bg-primary py-20 md:w-full">
        {/* CONTROL PANEL */}
        <ControlPanel
          table={table}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          view={view}
          setView={setView}
        />

        <div className="mt-4 w-5/6 py-5 text-left font-semibold">
          User Details
        </div>

        {/* CARD VIEW */}
        {view === "card" && (
          <CardView
            table={table}
            setGlobalFilter={setGlobalFilter}
            globalFilter={globalFilter}
          />
        )}

        {/* TABLE VIEW */}
        {view === "table" && <TableView table={table} />}
      </div>
    </>
  );
};

export default ManageUsers;
