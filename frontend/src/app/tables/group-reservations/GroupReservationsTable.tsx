// GroupReservationsTable.tsx
import React from "react";
import { DataTable } from "./data-table";
import { GroupReservation } from "./columns";
import { useReactTable } from "@tanstack/react-table";

interface GroupReservationsTableProps {
  table: ReturnType<typeof useReactTable<GroupReservation>>;
}

const GroupReservationsTable: React.FC<GroupReservationsTableProps> = ({
  table,
}) => {
  return <DataTable table={table} />;
};

export default GroupReservationsTable;
