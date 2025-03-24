import { Column, ColumnDef, ColumnMeta, Row } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader";
import { formatDate } from "date-fns";
import EventStatusCell from "./EventStatusCell";
import PaymentStatusCell from "./PaymentStatusCell";
import ViewCart from "./ViewCart";

// Module augmentation for custom meta type
declare module "@tanstack/react-table" {
  export interface ColumnMeta<TData = unknown, TValue = unknown> {
    title: string;
    _dummyData?: TData;
    _dummyValue?: TValue;
  }
}

// Updated Reservation-related interfaces
export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface CartItem {
  _id: string;
  title: string;
  quantity: number;
  totalPrice: number;
  image: string;
}

export interface Reservation {
  _id: string;
  userId: User;
  fullName: string;
  contactNumber: string;
  partySize: number;
  date: string;
  startTime: string;
  endTime: string;
  eventType: string;
  cart: CartItem[];
  eventStatus: string;
  paymentStatus: string;
  specialRequest: string;
  createdAt: string;
  updatedAt: string;
  totalPayment: number;
  eventFee: number;
  subtotal: number;
  isCorkage: boolean;
  __v: number;
}

// Extend ColumnDef with our custom meta type
export type MyColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  meta?: ColumnMeta<TData, TValue>;
};

// --- Columns Definition ---
export const columns: MyColumnDef<Reservation>[] = [
  {
    id: "userId",
    accessorFn: (row: Reservation) => row.userId._id,
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="User Id" />
    ),
    meta: { title: "userId" },
  },
  {
    accessorKey: "_id",
    header: "Transaction Id",
  },
  {
    accessorKey: "eventStatus",
    header: "Status",
    cell: ({ row }) => <EventStatusCell reservation={row.original} />,
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => <PaymentStatusCell reservation={row.original} />,
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
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
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
  },
  {
    id: "dateTime",
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Date & Time" />
    ),
    cell: ({ row }: { row: Row<Reservation> }) => {
      const { date, startTime, endTime } = row.original;
      const formattedDate = formatDate(new Date(date), "MM-dd-yyyy");
      return (
        <>
          <div className="text-center">{formattedDate}</div>
          <div className="text-xs text-gray-500">{`${startTime} - ${endTime}`}</div>
        </>
      );
    },
  },
  {
    accessorKey: "specialRequest",
    header: "Special Request",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ViewCart reservation={row.original} />,
  },
];
