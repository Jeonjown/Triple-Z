// MenuCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MenuItem } from "./columns";
import { Table as TanstackTable } from "@tanstack/react-table";
import { FaUtensils } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { SquarePen, Trash2 } from "lucide-react";
import DeleteConfirmationModal from "@/features/Menu/components/DeleteConfirmationModal";
import EditMenuItemModal from "@/features/Menu/components/EditMenuItemModal";
import { useDeleteMenuItem } from "@/features/Menu/hooks/useDeleteMenuItem";
import { useEditMenuItem } from "@/features/Menu/hooks/useEditMenuItem";

interface MenuCardProps {
  table: TanstackTable<MenuItem>;
}

const MenuCard: React.FC<MenuCardProps> = ({ table }) => {
  // Get the column visibility state from the table
  const { columnVisibility } = table.getState();

  // Get modal and edit/delete handlers
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {table.getRowModel().rows.map((row) => {
          // Format the createdAt date (customize as needed)
          const createdDate = new Date(
            row.original.createdAt,
          ).toLocaleDateString();
          return (
            <Card
              key={row.id}
              className="w-full shadow transition hover:shadow-lg"
            >
              <CardContent className="flex h-full flex-col p-4">
                {/* Top Row: ID and Action Buttons */}
                <div className="flex items-center justify-between">
                  {row.original._id && columnVisibility["_id"] !== false && (
                    <span className="text-xs">{row.original._id}</span>
                  )}

                  {columnVisibility["createdAt"] !== false && (
                    <div className="flex space-x-1 text-xs text-gray-500">
                      <div className="text-xs">{createdDate}</div>
                    </div>
                  )}
                </div>

                {/* Image or Fallback Icon */}
                {columnVisibility["image"] !== false &&
                  (row.original.image ? (
                    <img
                      src={row.original.image}
                      alt={row.original.title}
                      className="mx-auto mt-5 h-24 w-24 rounded object-cover"
                    />
                  ) : (
                    <FaUtensils
                      size={96}
                      className="mx-auto mt-2 text-primary"
                    />
                  ))}

                {/* Title */}
                {columnVisibility["title"] !== false && (
                  <div className="mx-auto mt-4 text-center text-2xl font-semibold">
                    {row.original.title}
                  </div>
                )}

                {columnVisibility["availability"] !== false && (
                  <div
                    className={`mx-auto text-center text-lg font-semibold ${
                      row.original.availability
                        ? "text-gray-500"
                        : "text-red-500"
                    }`}
                  >
                    {row.original.availability
                      ? "(Available)"
                      : "(Not Available)"}
                  </div>
                )}

                {/* Price Information */}
                {columnVisibility["basePrice"] !== false && (
                  <div className="mt-4 space-y-2">
                    {row.original.requiresSizeSelection ? (
                      row.original.sizes.map((size) => (
                        <div key={size._id} className="grid grid-cols-2">
                          <span className="font-medium">{size.size}:</span>
                          <span className="text-right">
                            ₱{size.sizePrice.toFixed(2)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="grid grid-cols-2">
                        <span className="font-medium">Price:</span>
                        <span className="text-right">
                          {row.original.basePrice !== null
                            ? `₱${row.original.basePrice.toFixed(2)}`
                            : "N/A"}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Category and Subcategory */}
                {columnVisibility["categoryName"] !== false &&
                  columnVisibility["subcategoryName"] !== false && (
                    <div className="mb-10 mt-4 space-y-2">
                      <div className="grid grid-cols-2">
                        <span className="font-medium">Category:</span>
                        <span className="text-right">
                          {row.original.categoryName}
                        </span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="font-medium">Subcategory:</span>
                        <span className="text-right">
                          {row.original.subcategoryName}
                        </span>
                      </div>
                    </div>
                  )}

                <div className="ml-auto mt-auto flex gap-2">
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
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default MenuCard;
