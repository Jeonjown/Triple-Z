// columns.ts
import { Column, ColumnDef, Row } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader";
import { formatDate } from "date-fns";
import EventStatusCell from "./EventStatusCell";
import PaymentStatusCell from "./PaymentStatusCell";
import ViewCart from "./ViewCart";

export interface Reservation {
  _id: string;
  userId: { _id: string; email: string };
  fullName: string;
  contactNumber: string;
  partySize: number;
  date: string;
  startTime: string;
  endTime: string;
  eventStatus: string;
  paymentStatus: string;
  specialRequest: string;
  createdAt: string;
  totalPayment: number;
  // other fields...
}

export type MyColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  meta?: { title: string };
};

export const columns: MyColumnDef<Reservation>[] = [
  {
    id: "userId",
    accessorFn: (row: Reservation) => row.userId._id,
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="User Id" />
    ),
    meta: { title: "User Id" },
  },
  {
    accessorKey: "_id",
    header: "Transaction Id",
    meta: { title: "Transaction Id" },
  },
  {
    accessorKey: "eventStatus",
    header: "Status",
    cell: ({ row }) => <EventStatusCell reservation={row.original} />,
    meta: { title: "Status" },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    filterFn: "equals",
    cell: ({ row }) => <PaymentStatusCell reservation={row.original} />,
    meta: { title: "Payment" },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const rawCreatedAt: string = row.getValue<string>("createdAt");
      const formattedDate = formatDate(new Date(rawCreatedAt), "MM-dd-yyyy");
      const formattedTime = formatDate(new Date(rawCreatedAt), "h:mm a");
      return (
        <>
          <div className="text-center">{formattedDate}</div>
          <div className="text-center text-xs text-gray-500">
            {formattedTime}
          </div>
        </>
      );
    },
    meta: { title: "Created At" },
  },
  {
    accessorKey: "totalPayment",
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Total Payment" />
    ),
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return `₱${value.toLocaleString()}`;
    },
    meta: { title: "Total Payment" },
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    meta: { title: "Full Name" },
  },
  {
    id: "email",
    accessorFn: (row: Reservation) => row.userId.email,
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    meta: { title: "Email" },
  },
  {
    accessorKey: "contactNumber",
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Contact No." />
    ),
    meta: { title: "Contact No." },
  },
  {
    accessorKey: "partySize",
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Party Size" />
    ),
    meta: { title: "Party Size" },
  },
  {
    id: "dateTime",
    // Combine date, startTime, and endTime into a single string for accessor
    accessorFn: (row: Reservation) =>
      `${row.date} ${row.startTime} ${row.endTime}`, // Added accessorFn
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Date & Time" />
    ),
    cell: ({ row }: { row: Row<Reservation> }) => {
      const { date, startTime, endTime } = row.original;
      const formattedDate = formatDate(new Date(date), "MM-dd-yyyy");
      return (
        <>
          <div className="text-center">{formattedDate}</div>
          <div className="text-xs text-gray-500">
            {startTime} - {endTime}
          </div>
        </>
      );
    },
    meta: { title: "Date & Time" },
  },
  {
    accessorKey: "specialRequest",
    header: "Special Request",
    meta: { title: "Special Request" },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ViewCart reservation={row.original} />,
    meta: { title: "Actions" },
  },
];
