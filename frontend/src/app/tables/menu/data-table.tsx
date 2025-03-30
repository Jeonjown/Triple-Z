import {
  flexRender,
  useReactTable,
  HeaderGroup,
  Header,
  Row,
  Cell,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import { SquarePen, Trash2 } from "lucide-react";

interface DataTableProps<TData> {
  table: ReturnType<typeof useReactTable<TData>>;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
}

export function DataTable<TData>({
  table,
  onEdit,
  onDelete,
}: DataTableProps<TData>): JSX.Element {
  // Define columns that should render as plain text (i.e. no sorting)
  const plainTextColumns = ["image"];

  return (
    <div className="rounded-md md:mt-5 md:border">
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-primary">
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: Header<TData, unknown>) => (
                  <TableHead
                    key={header.id}
                    className="whitespace-nowrap px-6 py-3 text-white"
                  >
                    {header.isPlaceholder ? null : plainTextColumns.includes(
                        header.column.id,
                      ) ? (
                      <div>
                        {typeof header.column.columnDef.header === "string"
                          ? header.column.columnDef.header
                          : ""}
                      </div>
                    ) : (
                      <DataTableColumnHeader
                        column={header.column}
                        title={
                          typeof header.column.columnDef.header === "string"
                            ? header.column.columnDef.header
                            : ""
                        }
                      />
                    )}
                  </TableHead>
                ))}
                {/* Extra header for Actions */}
                <TableHead className="whitespace-nowrap px-6 py-3 text-center text-white">
                  Actions
                </TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row: Row<TData>) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : ""}
                >
                  {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
                    <TableCell
                      key={cell.id}
                      className="whitespace-nowrap px-6 py-4 text-sm"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                  {/* Extra cell for actions */}
                  <TableCell className="space-x-2 whitespace-nowrap px-6 py-4">
                    <Button
                      size="icon"
                      onClick={() => onEdit && onEdit(row.original)}
                    >
                      <SquarePen size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => onDelete && onDelete(row.original)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getHeaderGroups()[0].headers.length + 1}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
