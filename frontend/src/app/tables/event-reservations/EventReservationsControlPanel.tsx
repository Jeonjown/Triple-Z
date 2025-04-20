// EventReservationsControlPanel.tsx
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
import useGetReservations from "@/features/Events/hooks/useGetEventReservations";
import LoadingPage from "@/pages/LoadingPage";
import { Reservation, columns } from "./columns";
import EventReservationsTable from "./EventReservationsTable";
import EventReservationsCard from "./EventReservationCard";
import { DataTableViewOptions } from "@/components/ui/DataTableViewOptions";

const EventReservationsControlPanel: React.FC = () => {
  // Fetch reservations
  const { data = { message: "", reservations: [] }, isPending } =
    useGetReservations() as {
      data: { message: string; reservations: Reservation[] };
      isPending: boolean;
    };
  const reservations: Reservation[] = data.reservations;

  // State for global filtering, sorting, and view toggle
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [view, setView] = useState<"table" | "card">("table");

  // Create table instance for both views
  const table = useReactTable<Reservation>({
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
        specialRequest: false,
        userId: false,
        _id: false,
        createdAt: false,
      },
    },
  });

  if (isPending) return <LoadingPage />;

  return (
    // Outer container: full width on mobile, max-width on desktop
    <div className="mx-auto max-w-7xl p-4 md:w-5/6">
      {/* Top Panel with three layers */}
      <div className="top-[105px] z-10 mx-auto mb-5 flex w-full flex-col gap-4 rounded border bg-white px-6 py-2 pt-6 shadow-md md:sticky">
        {/* Layer 1: Searchbar (always separate on mobile) */}
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

        {/* Layer 2: Filters & Toggle Column */}
        <div className="flex justify-between gap-3">
          <div className="flex space-x-3">
            {/* Event Status Filter */}
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
                <SelectItem value="All">All Events</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            {/* Payment Status Filter */}
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
                <SelectItem value="All">All Payments</SelectItem>
                <SelectItem value="Not Paid">Not Paid</SelectItem>
                <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Toggle Column (DataTable View Options) */}
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
          <EventReservationsTable table={table} />
        ) : (
          <EventReservationsCard
            reservations={table.getRowModel().rows.map((row) => row.original)}
            table={table}
          />
        )}
      </div>
    </div>
  );
};

export default EventReservationsControlPanel;
