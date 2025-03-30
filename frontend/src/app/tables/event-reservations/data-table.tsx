// MenuTable.tsx
import React from "react";

import { Table as TanstackTable } from "@tanstack/react-table";
import { MenuItem } from "../menu/columns";
import { DataTable } from "../group-reservations/data-table";

interface MenuTableProps {
  table: TanstackTable<MenuItem>;
}

const MenuTable: React.FC<MenuTableProps> = ({ table }) => {
  return <DataTable table={table} />;
};

export default MenuTable;
