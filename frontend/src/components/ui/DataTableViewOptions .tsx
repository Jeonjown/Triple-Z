import { Table } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { Checkbox } from "./checkbox"; // shadcn Checkbox component

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-full">
          <Settings2 />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide(),
          )
          .map((column) => (
            <div
              key={column.id}
              className="flex items-center space-x-2 px-2 py-1"
            >
              {/* shadcn Checkbox used instead of Radix DropdownMenuCheckboxItem */}
              <Checkbox
                checked={column.getIsVisible()}
                onCheckedChange={(value: boolean) =>
                  column.toggleVisibility(value)
                }
                className="cursor-pointer"
              />
              <span className="capitalize">
                {column.columnDef.meta?.title ||
                  (typeof column.columnDef.header === "string"
                    ? column.columnDef.header
                    : column.id)}
              </span>
            </div>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
