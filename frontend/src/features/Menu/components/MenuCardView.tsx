import { flexRender, Table } from "@tanstack/react-table";
import { MenuItem } from "../pages/ManageMenu";
import { useDeleteMenuItem } from "../hooks/useDeleteMenuItem";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import EditMenuItemModal from "./EditMenuItemModal";
import { useEditMenuItem } from "../hooks/useEditMenuItem";
import { ArrowUpDown, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MenuCardViewProps {
  table: Table<MenuItem>;
  globalFilter: string | undefined;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const MenuCardView = ({ table }: MenuCardViewProps) => {
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
      {/* Edit Modal */}
      {editMode && (
        <EditMenuItemModal
          setEditMode={setEditMode}
          itemToEdit={itemToEdit}
          setItemToEdit={setItemToEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        action={handleConfirmDelete}
      >
        {menuTitle}
      </DeleteConfirmationModal>

      {/* Cards Grid */}
      <div className="grid w-5/6 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {table.getRowModel().rows.map((row) => (
          <div
            key={row.id}
            className="flex min-w-0 flex-col space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-md transition hover:scale-105 hover:border-secondary hover:shadow-xl"
          >
            {/* Render each cell as a key-value pair */}
            {row.getVisibleCells().map((cell) => {
              const header = table
                .getHeaderGroups()
                .flatMap((group) => group.headers)
                .find((h) => h.id === cell.column.id);

              return (
                <div
                  key={cell.id}
                  className="flex items-center justify-between text-gray-600"
                >
                  {header && (
                    <div
                      className="flex items-center hover:scale-110 hover:cursor-pointer hover:opacity-80"
                      onClick={header.column.getToggleSortingHandler?.()}
                    >
                      {header.column.columnDef.header !== "Actions" && (
                        <span className="text-sm font-medium">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </span>
                      )}
                      {header.column.columnDef.header === "Actions" ? (
                        ""
                      ) : (
                        <ArrowUpDown className="ml-1 mr-3 size-3" />
                      )}
                    </div>
                  )}
                  <span className="truncate text-sm">
                    {cell.column.id === "availability" ? (
                      <>{cell.getValue() ? "Yes" : "No"}</>
                    ) : cell.column.id === "image" ? (
                      <img
                        src={cell.getValue() as string}
                        alt="Image"
                        className="h-16 w-16 rounded object-cover"
                      />
                    ) : cell.column.id === "price" ? (
                      <>₱ {cell.getValue()}</>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </span>
                </div>
              );
            })}

            {/* Action Buttons */}
            <div className="ml-auto flex gap-2">
              <Button onClick={() => handleEdit(row.original)} size="icon">
                <SquarePen size={20} />
              </Button>
              <Button
                onClick={() => handleDelete(row.original)}
                size="icon"
                variant="destructive"
              >
                <Trash2 size={20} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MenuCardView;
