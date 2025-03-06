// GroupColumns.ts
import { Column, ColumnDef, ColumnMeta } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { formatDate } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import EventStatusCell from "./EventStatusCell";
import PaymentStatusCell from "./PaymentStatusCell";

// Module augmentation for custom meta type
declare module "@tanstack/react-table" {
  export interface ColumnMeta<TData = unknown, TValue = unknown> {
    title: string;
    _dummyData?: TData;
    _dummyValue?: TValue;
  }
}

// Interfaces for group reservations (similar to events)
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

export interface GroupReservation {
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
  __v: number;
}

// Extend ColumnDef with our custom meta type
export type MyColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  meta?: ColumnMeta<TData, TValue>;
};

// --- Group Columns Definition ---
export const columns: MyColumnDef<GroupReservation>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "_id",
    header: "Transaction Id",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const rawCreatedAt: string = row.getValue<string>("createdAt");
      return formatDate(new Date(rawCreatedAt), "MM-dd-yyyy h:mm a");
    },
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
    accessorKey: "totalPayment",
    header: ({ column }: { column: Column<GroupReservation, unknown> }) => (
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
    accessorFn: (row: GroupReservation) => row.userId.email,
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
  },
  {
    accessorKey: "date",
    header: ({ column }: { column: Column<GroupReservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const rawDate = row.getValue<string>("date");
      return formatDate(new Date(rawDate), "MM-dd-yyyy");
    },
  },
  {
    id: "timeRange",
    header: "Time Range",
    accessorFn: (row: GroupReservation) => `${row.startTime} - ${row.endTime}`,
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const reservation = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(reservation._id)}
            >
              Copy reservation ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View details</DropdownMenuItem>
            {/* <DeleteReservationAction reservationId={reservation._id} /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
