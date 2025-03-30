// MenuControlPanel.tsx
import React, { useState } from "react";
import {
  useReactTable,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { MenuItem, columns } from "./columns";
import useFetchAllMenuItems from "@/features/Menu/hooks/useFetchAllMenuItems";
import CreateMenuItemModal from "@/features/Menu/components/CreateMenuItemModal";
import useCreateMenuItemModal from "@/features/Menu/hooks/useCreateMenuItemModal";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Layers,
  Plus,
  Search,
  Table2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTableViewOptions } from "@/components/ui/DataTableViewOptions";
import useFetchAllCategories from "@/features/Menu/hooks/useFetchAllCategories";
import useFetchAllSubcategories from "@/features/Menu/hooks/useFetchAllSubcategories";
import MenuTable from "./MenuTable";
import MenuCard from "./MenuCard";

const MenuControlPanel: React.FC = () => {
  // Fetch menu items
  const { data: menuItems, isError, error, isPending } = useFetchAllMenuItems();

  // Create state for filtering, sorting, view toggle, etc.
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [view, setView] = useState<"card" | "table">("table");

  // Create table instance (with default hidden columns if needed)
  const table = useReactTable<MenuItem>({
    data: menuItems || [],
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 5 },
      columnVisibility: { _id: false, createdAt: false },
    },
  });

  // Create modal hook for creating menu items
  const { handleCreate, isCreateModalOpen, setIsCreateModalOpen } =
    useCreateMenuItemModal();

  // Fetch categories and subcategories from API
  const { data: categories } = useFetchAllCategories();
  // Use state to hold the selected category's _id (to fetch subcategories)
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >(undefined);
  const { data: subcategories } = useFetchAllSubcategories(selectedCategoryId);

  // Build options with an "All" option prepended
  const categoryOptions = categories
    ? [{ _id: "All", category: "All" }, ...categories]
    : [{ _id: "All", category: "All" }];
  const subcategoryOptions = subcategories
    ? [{ _id: "All", subcategory: "All" }, ...subcategories]
    : [{ _id: "All", subcategory: "All" }];

  if (isPending) return <div>Loading...</div>;
  if (isError)
    return <div>{error?.message || "Failed to load menu items"}</div>;

  return (
    <>
      {isCreateModalOpen && (
        <CreateMenuItemModal
          isCreateModalOpen={isCreateModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
        />
      )}
      <div className="sticky top-[105px] z-10 mx-auto mb-5 w-full rounded border bg-white px-6 py-2 pt-6 shadow-md md:w-5/6">
        {/* Layer 1: Searchbar */}
        <div className="relative">
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>

        {/* Layer 2: Filters & View Options */}
        <div className="mt-4 flex justify-between gap-3">
          <div className="flex space-x-3">
            {/* Category Filter */}
            <Select
              value={selectedCategoryId || "All"}
              onValueChange={(value: string) => {
                if (value === "All") {
                  setSelectedCategoryId(undefined);
                  table.getColumn("categoryName")?.setFilterValue(undefined);
                } else {
                  setSelectedCategoryId(value);
                  // Look up the category name based on the selected _id
                  const cat = categoryOptions.find((opt) => opt._id === value);
                  table
                    .getColumn("categoryName")
                    ?.setFilterValue(cat?.category);
                }
              }}
              aria-label="Filter by category"
            >
              <SelectTrigger className="w-30 md:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((opt) => (
                  <SelectItem key={opt._id} value={opt._id}>
                    {opt.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Subcategory Filter */}
            <Select
              value={
                (table
                  .getColumn("subcategoryName")
                  ?.getFilterValue() as string) || "All"
              }
              onValueChange={(value: string) =>
                table
                  .getColumn("subcategoryName")
                  ?.setFilterValue(value === "All" ? undefined : value)
              }
              aria-label="Filter by subcategory"
            >
              <SelectTrigger className="w-30 md:w-40">
                <SelectValue placeholder="Subcategory" />
              </SelectTrigger>
              <SelectContent>
                {subcategoryOptions.map((opt) => (
                  <SelectItem key={opt._id} value={opt.subcategory}>
                    {opt.subcategory}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Column Visibility Options */}
          <div className="h-10">
            <DataTableViewOptions table={table} />
          </div>
        </div>

        {/* Layer 3: View Toggle & Pagination Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-evenly text-sm">
          <div className="mb-4 flex items-center space-x-4">
            {/* View Toggle (Card vs Table) */}
            <div className="flex rounded-lg border">
              <div
                className={`${
                  view === "card" ? "bg-primary text-white" : "bg-secondary"
                } rounded-s-lg p-2 transition hover:cursor-pointer hover:opacity-80`}
                onClick={() => setView("card")}
              >
                <Layers size={20} />
              </div>
              <div
                className={`${
                  view === "table" ? "bg-primary text-white" : "bg-secondary"
                } rounded-r-lg p-2 transition hover:cursor-pointer hover:opacity-80`}
                onClick={() => setView("table")}
              >
                <Table2 size={20} />
              </div>
            </div>
            <span>Items per page</span>
            <select
              className="rounded-md border border-gray-300 p-2 shadow-sm focus:border-secondary focus:ring-primary"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[5, 10, 20, 30, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 flex items-center space-x-2">
            <Button
              size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft />
            </Button>
            <Button
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft />
            </Button>
            <span className="flex items-center">
              <input
                type="number"
                min={1}
                max={table.getPageCount()}
                value={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="w-16 rounded-md border border-gray-300 p-2 text-center"
              />
              <span className="ml-1">of {table.getPageCount()}</span>
            </span>
            <Button
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight />
            </Button>
            <Button
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>

      {/* Title and Create Button */}
      <div className="mx-auto mt-4 flex w-full items-center justify-between py-5 text-left font-semibold md:w-5/6">
        <div className="text-xl">Menu Details</div>
        <Button size="icon" onClick={handleCreate}>
          <Plus size={20} />
        </Button>
      </div>

      {/* Render the selected view */}
      <div className="mx-auto w-full md:w-5/6">
        {view === "card" ? (
          <MenuCard table={table} />
        ) : (
          <MenuTable table={table} />
        )}
      </div>
    </>
  );
};

export default MenuControlPanel;
