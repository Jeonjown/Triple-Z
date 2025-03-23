import { Column, ColumnDef, ColumnMeta, Row } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader";
import { formatDate } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
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
  // Checkbox column for row selection
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // User Id column
  {
    id: "userId",
    accessorFn: (row: Reservation) => row.userId._id,
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="User Id" />
    ),
    meta: { title: "userId" },
  },
  // Transaction Id column
  {
    accessorKey: "_id",
    header: "Transaction Id",
  },
  // Created At column with formatted date and time
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const rawCreatedAt: string = row.getValue<string>("createdAt");
      return formatDate(new Date(rawCreatedAt), "MM-dd-yyyy h:mm a");
    },
  },
  // Event Status column
  {
    accessorKey: "eventStatus",
    header: "Status",
    cell: ({ row }) => <EventStatusCell reservation={row.original} />,
  },
  // Payment Status column
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => <PaymentStatusCell reservation={row.original} />,
  },
  // Total Payment column
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
  // Full Name column
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
  },
  // Email column using the user's email from userId
  {
    id: "email",
    accessorFn: (row: Reservation) => row.userId.email,
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    meta: { title: "Email" },
  },
  // Contact Number column
  {
    accessorKey: "contactNumber",
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Contact No." />
    ),
    meta: { title: "Contact No." },
  },
  // Party Size column
  {
    accessorKey: "partySize",
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Party Size" />
    ),
  },
  // Merged Date & Time column with date on top and time below
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
  // Special Request column
  {
    accessorKey: "specialRequest",
    header: "Special Request",
  },
  // Actions column with dropdown menu including View Cart option
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ViewCart reservation={row.original} />,
  },
];
