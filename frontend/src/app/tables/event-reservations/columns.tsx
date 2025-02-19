import { Column, ColumnDef, ColumnMeta } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader";

// Module augmentation to add our custom meta type.
// 1. We export the interface so it can be referenced outside the module.
// 2. We add dummy properties (_dummyData and _dummyValue) to "use" the generic types
//    and avoid the "defined but never used" warnings.
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
    accessorKey: "_id",
    header: "Id",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    id: "email",
    accessorFn: (row: Reservation) => row.userId.email,
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    meta: { title: "Email" }, // Added meta title
  },
  {
    accessorKey: "contactNumber",
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Contact No." />
    ),
    meta: { title: "Contact No." }, // Added meta title
  },
  {
    accessorKey: "partySize",
    header: "Party Size",
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
];
