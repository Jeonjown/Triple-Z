import { Table } from "@tanstack/react-table";

import UserTableView from "./UserTableView";
import { useState } from "react";
import UserCardView from "./UserCardView";
import { User } from "../pages/ManageUsers";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Layers,
  Search,
  Table2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CardViewProps {
  table: Table<User>;
  globalFilter: string | undefined;
  title: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const UserControlPanel = ({
  table,
  globalFilter,
  setGlobalFilter,
  title,
}: CardViewProps) => {
  const [view, setView] = useState<string | undefined>("card");

  return (
    <>
      <div className="sticky top-[105px] z-10 mx-auto mb-5 w-5/6 rounded border bg-white px-6 py-2 pt-6 shadow-md">
        <div className="relative">
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 transform text-gray-400" />
        </div>
        {/* PAGINATION */}

        <div className="mt-6 flex flex-wrap items-center justify-evenly text-sm">
          <div className="mb-4 mr-2 flex items-center">
            <div className="mx-4 flex rounded-lg border">
              {/* Card View Icon */}
              <div
                className={`${
                  view === "card" ? "bg-primary text-white" : "bg-secondary"
                } rounded-s-lg p-2 transition hover:cursor-pointer hover:opacity-80`}
              >
                <Layers size={20} onClick={() => setView("card")} />
              </div>

              {/* Table View Icon */}
              <div
                className={`${
                  view === "table" ? "bg-primary text-white" : "bg-secondary"
                } rounded-r-lg p-2 transition hover:cursor-pointer hover:opacity-80`}
              >
                <Table2 onClick={() => setView("table")} size={20} />
              </div>
            </div>
            <span className="mr-2">Items per page</span>
            <select
              className="rounded-md border border-gray-300 p-2 shadow-sm focus:border-secondary focus:ring-primary"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 20, 30, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 ml-4 flex items-center space-x-2">
            <Button
              size={"icon"}
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft />
            </Button>
            <Button
              size={"icon"}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft />
            </Button>

            <span className="flex items-center">
              <input
                min={1}
                max={table.getPageCount()}
                type="number"
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
              size={"icon"}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight />
            </Button>
            <Button
              size={"icon"}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-4 w-5/6 pb-10 text-left font-semibold">{title}</div>
      {/* CARD VIEW */}

      {view === "card" && <UserCardView table={table} />}

      {/* TABLE VIEW */}
      {view === "table" && <UserTableView table={table} />}
    </>
  );
};

export default UserControlPanel;
