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
  sizes: { _id: string; size: string; sizePrice: number }[];
  requiresSizeSelection: boolean;
  description: string;
  availability?: boolean;
  createdAt: string;
  categoryId?: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
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
        return sizes.map((size) => (
          <div key={size._id}>
            {size.size}: ₱
            {size.sizePrice != null ? size.sizePrice.toFixed(2) : "None"}
          </div>
        ));
      },
      header: "Sizes",
    }),

    columnHelper.accessor("categoryName", {
      cell: (info) => info.getValue(),
      header: "Category",
    }),
    columnHelper.accessor("subcategoryName", {
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

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    // Handle error (404 or other issues)
    return <div>{error?.message || "Failed to load menu items"}</div>;
  }

  return (
    <div className="mx-auto flex min-h-full w-full min-w-min flex-col items-center pb-20">
      <MenuControlPanel
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        title={title}
        isCreateModalOpen={true}
      />
      {data?.length === 0 && <div>No menu items found</div>}
    </div>
  );
};

export default ManageMenu;
