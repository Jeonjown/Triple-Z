import { useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import MenuControlPanel from "../components/MenuControlPanel";
import useFetchAllMenuItems from "../hooks/useFetchAllMenuItems";

export interface MenuItem {
  _id: string;
  title: string;
  image: string;
  price: number;
  size: string;
  description: string;
  availability: boolean;
  createdAt?: string;
  category?: string;
  subcategory?: string;
}

const ManageMenu = () => {
  const [title] = useState<string>("Menu Details");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string | undefined>("");
  const { data } = useFetchAllMenuItems();

  const columnHelper = createColumnHelper<MenuItem>();
  const columns = [
    columnHelper.accessor("createdAt", {
      cell: (info) => info.getValue(),
      header: "Created At",
      enableHiding: true,
    }),
    columnHelper.accessor("_id", {
      cell: (info) => info.getValue(),
      header: "ID",
    }),
    columnHelper.accessor("image", {
      cell: (info) => (
        <img
          className="h-16 w-16 rounded object-cover"
          src={info.getValue()}
          alt={info.getValue()}
        />
      ),
      header: "Image",
    }),
    columnHelper.accessor("title", {
      cell: (info) => info.getValue(),
      header: "Item",
    }),

    columnHelper.accessor("price", {
      cell: (info) => `$${info.getValue().toFixed(2)}`,
      header: "Price",
    }),
    columnHelper.accessor("category", {
      cell: (info) => info.getValue(),
      header: "Category",
    }),
    columnHelper.accessor("subcategory", {
      cell: (info) => info.getValue(),
      header: "Subcategory",
    }),
    columnHelper.accessor("availability", {
      cell: (info) => (info.getValue() ? "Available" : "Out of Stock"),
      header: "Availability",
    }),
    columnHelper.accessor("size", {
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 200,
      header: "Size",
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
        pageSize: 10,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (!data) {
    // Optionally handle loading or error state
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center bg-primary py-20 md:w-full">
      <MenuControlPanel
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        title={title}
      />
    </div>
  );
};

export default ManageMenu;
