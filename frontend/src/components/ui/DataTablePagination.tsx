import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Button } from "./button";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex flex-col items-center space-y-4 border-t px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8 md:py-4">
      {/* Info Section */}
      <div className="flex w-full flex-col items-center justify-center space-y-2 md:flex-row md:space-x-4 md:space-y-0">
        {/* First info group */}
        <div className="flex flex-1 justify-center">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-1">
              <p className="text-xs text-gray-600">Confirmed:</p>
              <div className="h-4 w-4 rounded border bg-[#FABC2C]"></div>
            </div>
            <div className="flex items-center space-x-1">
              <p className="text-xs text-gray-600">Pending:</p>
              <div className="h-4 w-4 rounded bg-[#3BB537]"></div>
            </div>
            <div className="flex items-center space-x-1">
              <p className="text-xs text-gray-600">Canceled:</p>
              <div className="h-4 w-4 rounded bg-[#EE4549]"></div>
            </div>
            <div className="flex items-center space-x-1">
              <p className="text-xs text-gray-600">Completed:</p>
              <div className="h-4 w-4 rounded bg-[#043A7B]"></div>
            </div>
          </div>
        </div>
        {/* Second info group */}
        <div className="flex flex-1 justify-center">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-1">
              <p className="text-xs text-gray-600">Canceled:</p>
              <div className="h-4 w-4 rounded bg-[#3BB537]"></div>
            </div>
            <div className="flex items-center space-x-1">
              <p className="text-xs text-gray-600">Partially Paid:</p>
              <div className="h-4 w-4 rounded border bg-[#FABC2C]"></div>
            </div>
            <div className="flex items-center space-x-1">
              <p className="text-xs text-gray-600">Paid:</p>
              <div className="h-4 w-4 rounded bg-[#EE4549]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col items-center space-y-2 md:flex-row md:items-center md:space-x-6 lg:space-x-8">
        {/* Rows per page select */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center space-x-2">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
