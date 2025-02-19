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

// Module augmentation to add our custom meta type.

declare module "@tanstack/react-table" {
  export interface ColumnMeta<TData = unknown, TValue = unknown> {
    title: string;
    // Dummy properties to utilize the generic parameters (no runtime effect)
    _dummyData?: TData;
    _dummyValue?: TValue;
  }
}

// Represents a user object inside a reservation.
export interface User {
  _id: string;
  username: string;
  email: string;
}

// Represents an individual item in the cart.
export interface CartItem {
  _id: string;
  title: string;
  quantity: number;
  totalPrice: number;
  image: string;
}

// Represents a reservation.
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
  status: string;
  specialRequest: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Extend ColumnDef with our custom meta type using module augmentation.
export type MyColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  meta?: ColumnMeta<TData, TValue>;
};

export const columns: MyColumnDef<Reservation>[] = [
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
    header: "Id",
  },
  {
    // Status column now renders as a dropdown
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const reservation = row.original;

      const updateStatus = (newStatus: string) => {
        console.log(`Update status for ${reservation._id} to ${newStatus}`);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 w-20 p-0">
              {reservation.status}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => updateStatus("Pending")}>
              Pending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateStatus("Confirmed")}>
              Confirmed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateStatus("Canceled")}>
              Canceled
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateStatus("Completed")}>
              Completed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
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
    accessorKey: "date",
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    // Format the date as MM-dd-yyyy (Month-Day-Year)
    cell: ({ row }) => {
      const rawDate = row.getValue<string>("date");
      return formatDate(new Date(rawDate), "MM-dd-yyyy");
    },
  },
  {
    id: "timeRange",
    header: "Time Range",
    accessorFn: (row: Reservation) => `${row.startTime} - ${row.endTime}`,
  },
  {
    accessorKey: "specialRequest",
    header: "Special Request",
  },
  {
    id: "actions",
    enableHiding: false, // Always visible actions column
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
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
