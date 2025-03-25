// EventReservationsTable.tsx
import React from "react";
import { Reservation } from "./columns";
import { DataTable } from "./data-table";
import { useReactTable } from "@tanstack/react-table";

interface EventReservationsTableProps {
  table: ReturnType<typeof useReactTable<Reservation>>;
}

const EventReservationsTable: React.FC<EventReservationsTableProps> = ({
  table,
}) => {
  return <DataTable table={table} />;
};

export default EventReservationsTable;
