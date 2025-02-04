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
  _id?: string;
  title: string;
  image: string;
  basePrice: number | null;
  sizes: { size: string; sizePrice: number }[];
  requiresSizeSelection: boolean;
  description: string;
  availability?: boolean;
  createdAt: string;
  category: string;
  subcategory: string;
}

const ManageMenu = () => {
  const [title] = useState<string>("Menu Details");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string | undefined>("");

  const { data, isError, error, isPending } = useFetchAllMenuItems();

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
    columnHelper.accessor("basePrice", {
      cell: (info) => {
        const basePrice = info.getValue();
        return basePrice != null ? `₱${basePrice.toFixed(2)}` : "None";
      },
      header: "Base Price",
    }),
    columnHelper.accessor("sizes", {
      cell: (info) => {
        const sizes = info.getValue();
        return sizes.map((size: { size: string; sizePrice: number }) => (
          <div key={size.size}>
            {size.size}: ₱
            {size.sizePrice != null ? size.sizePrice.toFixed(2) : "None"}
          </div>
        ));
      },
      header: "Sizes",
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
  ];

  const table = useReactTable({
    data: data || [],
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

  return (
    <div className="flex flex-col items-center justify-center bg-primary py-20 md:w-full">
      <MenuControlPanel
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        title={title}
        isCreateModalOpen={true}
      />
      {isPending && <p>Loading...</p>}
      {isError && <p className="text-xl"> {error?.message}</p>}
    </div>
  );
};

export default ManageMenu;
