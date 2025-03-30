// EventReservationsTable.tsx
import React from "react";
import { Reservation } from "./columns";
import { useReactTable } from "@tanstack/react-table";
import DataTable from "./data-table";

interface EventReservationsTableProps {
  table: ReturnType<typeof useReactTable<Reservation>>;
}

const EventReservationsTable: React.FC<EventReservationsTableProps> = ({
  table,
}) => {
  return <DataTable table={table} />;
};

export default EventReservationsTable;
