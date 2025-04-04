// columns.ts
import { Column, ColumnDef, Row } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader";
import { formatDate } from "date-fns";
import EventStatusCell from "./EventStatusCell";
import PaymentStatusCell from "./PaymentStatusCell";
import GroupReservationActions from "./GroupReservationActions";

export interface CartItem {
  _id: string;
  title: string;
  quantity: number;
  totalPrice: number;
  image: string;
}

export interface GroupReservation {
  message: string;
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  fullName: string;
  contactNumber: string;
  date: string;
  startTime: string;
  endTime: string;
  partySize: number;
  cart: Array<{
    _id: string;
    title: string;
    quantity: number;
    totalPrice: number;
    image: string;
  }>;
  eventStatus: string;
  paymentStatus: string;
  subtotal: number;
  totalPayment: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type MyColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  meta?: { title: string };
};

export const columns: MyColumnDef<GroupReservation>[] = [
  {
    id: "userId",
    // Use optional chaining and provide a fallback if userId is null
    accessorFn: (row: GroupReservation) =>
      row.userId ? row.userId._id : "No User",
    header: ({ column }: { column: Column<GroupReservation, unknown> }) => (
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
    header: ({ column }: { column: Column<GroupReservation, unknown> }) => (
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
    accessorFn: (row: GroupReservation) => row.userId?.email || "No Email",
    header: ({ column }: { column: Column<GroupReservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    meta: { title: "Email" },
  },
  {
    accessorKey: "contactNumber",
    header: ({ column }: { column: Column<GroupReservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Contact No." />
    ),
    meta: { title: "Contact No." },
  },
  {
    accessorKey: "partySize",
    header: ({ column }: { column: Column<GroupReservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Party Size" />
    ),
    meta: { title: "Party Size" },
  },
  {
    id: "dateTime",
    // Combine date, startTime, and endTime into a single string for accessor
    accessorFn: (row: GroupReservation) =>
      `${row.date} ${row.startTime} ${row.endTime}`, // Added accessorFn
    header: ({ column }: { column: Column<GroupReservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Date & Time" />
    ),
    cell: ({ row }: { row: Row<GroupReservation> }) => {
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
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <GroupReservationActions reservation={row.original} />,
    meta: { title: "Actions" },
  },
];
