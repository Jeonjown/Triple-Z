import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Layers,
  Table2,
  Search,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetGroupReservations from "@/features/Events/hooks/useGetGroupReservations";
import LoadingPage from "@/pages/LoadingPage";
import GroupReservationCard from "./GroupReservationCard";
import GroupReservationsTable from "./GroupReservationsTable";
import { columns } from "./columns";
import { DataTableViewOptions } from "@/components/ui/DataTableViewOptions";

const GroupReservationsControlPanel: React.FC = () => {
  // Fetch reservations (default to an empty array)
  const { data = { message: "", reservations: [] }, isPending } =
    useGetGroupReservations();
  const reservations = data.reservations;

  // Local state for filtering, sorting, and view toggle
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [view, setView] = useState<"table" | "card">("table");

  // Create table instance using the fetched reservations
  const table = useReactTable({
    data: reservations,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 30 },
      columnVisibility: {
        _id: false,
        createdAt: false,
        userId: false,
      },
    },
  });

  if (isPending) return <LoadingPage />;

  return (
    // Outer container with same width and padding as EventReservationsControlPanel
    <div className="mx-auto p-4 md:w-5/6">
      {/* Top Panel: Search, Filters & View Options */}
      <div className="top-[105px] z-10 mx-auto mb-5 flex w-full flex-col gap-4 rounded border bg-white px-6 py-2 pt-6 shadow-md md:sticky">
        {/* Layer 1: Search Input */}
        <div className="w-full">
          <div className="relative">
            <Input
              placeholder="Search..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>

        {/* Layer 2: Filters & Toggle Columns */}
        <div className="flex justify-between gap-3">
          <div className="flex space-x-3">
            {/* Example Filter (adapt as needed) */}
            <Select
              value={
                (table.getColumn("eventStatus")?.getFilterValue() as string) ||
                "All"
              }
              onValueChange={(value: string) =>
                table
                  .getColumn("eventStatus")
                  ?.setFilterValue(value === "All" ? undefined : value)
              }
              aria-label="Filter by event status"
            >
              <SelectTrigger className="w-30 md:w-40">
                <SelectValue placeholder="Filter by event status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All"> All Groups</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={
                (table
                  .getColumn("paymentStatus")
                  ?.getFilterValue() as string) || "All"
              }
              onValueChange={(value: string) =>
                table
                  .getColumn("paymentStatus")
                  ?.setFilterValue(value === "All" ? undefined : value)
              }
              aria-label="Filter by payment status"
            >
              <SelectTrigger className="w-30 md:w-40">
                <SelectValue placeholder="Filter by payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All"> All Payments</SelectItem>
                <SelectItem value="Not Paid">Not Paid</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Toggle Column Options */}
          <div className="h-10">
            <DataTableViewOptions table={table} />
          </div>
        </div>

        {/* Layer 3: View Toggle & Pagination Controls */}
        <div className="flex flex-wrap items-center justify-evenly gap-4 p-2 text-sm">
          {/* View Toggle */}
          <div className="flex items-center space-x-2">
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
            <span className="mr-2">Items per page</span>
            <select
              className="rounded-md border border-gray-300 p-2 shadow-sm focus:border-secondary focus:ring-primary"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[10, 20, 30, 40, 50].map((pageSize: number) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-2">
            <Button
              size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft size={16} />
            </Button>
            <Button
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft size={16} />
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
              <ChevronRight size={16} />
            </Button>
            <Button
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Render the selected view */}
      <div className="mx-auto w-full">
        {view === "table" ? (
          <GroupReservationsTable table={table} />
        ) : (
          // Wrap the cards in a grid to display three per row on large screens
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {table.getRowModel().rows.length > 0 ? (
              table
                .getRowModel()
                .rows.map((row) => (
                  <GroupReservationCard
                    key={row.original._id}
                    reservation={row.original}
                  />
                ))
            ) : (
              <p>No reservations found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupReservationsControlPanel;
