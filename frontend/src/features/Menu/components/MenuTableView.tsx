import { flexRender, Table as TanstackTable } from "@tanstack/react-table";
import { MenuItem } from "../pages/ManageMenu";
import { useEditMenuItem } from "../hooks/useEditMenuItem";
import EditMenuItemModal from "./EditMenuItemModal";
import { useDeleteMenuItem } from "../hooks/useDeleteMenuItem";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { SquarePen, Trash2, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface MenuTableViewProps {
  table: TanstackTable<MenuItem>;
}

const getColumnClassNames = (columnId: string, type: "head" | "cell") => {
  switch (columnId) {
    case "title":
      return type === "head" ? "sm:table-cell font-bold" : "sm:table-cell";
    case "price":
      return type === "head" ? "sm:table-cell font-bold" : "sm:table-cell";
    case "availability":
      return type === "head"
        ? "hidden lg:table-cell font-bold"
        : "hidden lg:table-cell";
    case "image":
      return type === "head"
        ? "hidden xl:table-cell font-bold"
        : "hidden xl:table-cell";
    default:
      return "";
  }
};

const MenuTableView = ({ table }: MenuTableViewProps) => {
  const { editMode, setEditMode, itemToEdit, setItemToEdit, handleEdit } =
    useEditMenuItem();
  const {
    handleDelete,
    menuTitle,
    showConfirmation,
    setShowConfirmation,
    handleConfirmDelete,
  } = useDeleteMenuItem();

  return (
    <>
      {editMode && (
        <EditMenuItemModal
          setEditMode={setEditMode}
          itemToEdit={itemToEdit}
          setItemToEdit={setItemToEdit}
        />
      )}

      <DeleteConfirmationModal
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        action={handleConfirmDelete}
      >
        {menuTitle}
      </DeleteConfirmationModal>

      <div className="mx-auto w-5/6 flex-col rounded-lg">
        <div className="overflow-x-auto rounded-lg bg-white shadow-md">
          <Table>
            <TableHeader className="bg-primary">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={`${getColumnClassNames(header.column.id, "head")} px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white`}
                    >
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none flex items-center"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanSort() && (
                          <ArrowUpDown className="ml-1 mr-3 size-3" />
                        )}
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="bg-primary px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                    Actions
                  </TableHead>
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="divide-y divide-gray-200 bg-white">
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="transition hover:bg-gray-200">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`${getColumnClassNames(cell.column.id, "cell")} whitespace-nowrap px-6 py-4 text-sm text-text`}
                    >
                      {cell.column.id === "price" ? (
                        <span className="truncate text-sm">{`₱ ${cell.getValue()}`}</span>
                      ) : (
                        <span className="truncate text-sm">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </span>
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="mt-1 flex items-center gap-2 py-4">
                    <Button
                      onClick={() => handleEdit(row.original)}
                      size="icon"
                    >
                      <SquarePen size={20} />
                    </Button>
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <Button
                              onClick={() => handleDelete(row.original)}
                              size="icon"
                              variant="destructive"
                              className="disabled:cursor-not-allowed disabled:bg-secondary"
                              disabled={row.original._id === undefined}
                            >
                              <Trash2 size={20} />
                            </Button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>You cannot delete this item.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default MenuTableView;
