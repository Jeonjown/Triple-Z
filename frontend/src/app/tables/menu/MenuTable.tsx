import React from "react";

import { Table as TanstackTable } from "@tanstack/react-table";
import { MenuItem } from "./columns";
import { useEditMenuItem } from "@/features/Menu/hooks/useEditMenuItem";
import { useDeleteMenuItem } from "@/features/Menu/hooks/useDeleteMenuItem";
import EditMenuItemModal from "@/features/Menu/components/EditMenuItemModal";
import DeleteConfirmationModal from "@/features/Menu/components/DeleteConfirmationModal";
import { DataTable } from "./data-table";

interface MenuTableProps {
  table: TanstackTable<MenuItem>;
}

const MenuTable: React.FC<MenuTableProps> = ({ table }) => {
  // Bring back the actions logic as in your MenuCard
  const { editMode, setEditMode, itemToEdit, setItemToEdit, handleEdit } =
    useEditMenuItem();
  const {
    handleDelete,
    menuTitle,
    showConfirmation,
    setShowConfirmation,
    handleConfirmDelete,
  } = useDeleteMenuItem();

  // Wrap the edit and delete actions so they can be passed to DataTable
  const onEdit = (row: MenuItem) => {
    handleEdit(row);
  };

  const onDelete = (row: MenuItem) => {
    handleDelete(row);
  };

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
      <DataTable table={table} onEdit={onEdit} onDelete={onDelete} />
    </>
  );
};

export default MenuTable;
