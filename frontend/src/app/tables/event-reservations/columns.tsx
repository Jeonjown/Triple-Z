// columns.ts
import { Column, ColumnDef, Row } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader";
// Using date-fns for formatting dates
import { format, parse, addHours } from "date-fns";
import EventStatusCell from "./EventStatusCell"; // Assuming these exist for status coloring
import PaymentStatusCell from "./PaymentStatusCell"; // Assuming these exist for status coloring

import EventReservationActions from "./EventReservationActions"; // Assuming this exists for actions column
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Assuming tooltip components
import { Copy } from "lucide-react"; // Assuming lucide-react icons

// Define CartItem interface (ensure it matches your backend/frontend structure)
export interface CartItem {
  _id: string;
  title: string;
  quantity: number;
  totalPrice: number;
  image: string;
  size?: string; // Added size based on sample data
  isAddOn?: boolean; // Added isAddOn based on sample data
}

// Define Reservation interface with all the necessary fields
export interface Reservation {
  _id: string;
  userId: {
    // Assuming userId is populated in the response
    _id: string;
    username: string; // Added username
    email: string;
  };
  fullName: string;
  contactNumber: string;
  partySize: number;
  date: string; // ISO string
  startTime: string; // e.g., "10:00 AM"
  endTime: string; // e.g., "06:00 PM"
  estimatedEventDuration?: number; // Added based on backend
  eventType?: string; // e.g., "Meeting", "Seminar" - Added
  cart: CartItem[];
  eventStatus: string; // e.g., "Pending", "Confirmed", "Cancelled", "Completed"
  createdAt: string; // ISO string
  updatedAt: string; // Added updatedAt
  specialRequest: string;
  totalPayment: number; // Total reservation price - Added
  eventFee: number; // Event fee applied - Added
  subtotal: number; // Cart subtotal - Added
  paymentStatus: string; // e.g., "Not Paid", "Partially Paid", "Paid" - Added
  paymentMethod?: string; // Added paymentMethod
  isCorkage: boolean; // Added isCorkage
  corkageFee?: number; // Added based on backend
  reservationType: string; // e.g., "Event", "Groups" - Added
  paymentLink?: string | null; // Payment link URL (optional, can be null) - Added
  paymentData?: any | null; // Payment gateway response data (optional, can be null) - Added
  balanceDue?: number; // Added based on backend - Added
  __v: number;
}

export type MyColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  meta?: { title: string };
};

// Helper function to format currency
const formatCurrency = (amount?: number | null) =>
  amount != null ? `₱${amount.toFixed(2)}` : "₱--.--";

export const columns: MyColumnDef<Reservation>[] = [
  {
    accessorKey: "eventStatus",
    header: "Event Status", // Renamed header
    cell: ({ row }) => <EventStatusCell reservation={row.original} />,
    meta: { title: "Event Status" }, // Updated meta title
  },

  {
    accessorKey: "paymentStatus",
    header: "Payment Status", // Renamed header
    filterFn: "equals",
    cell: ({ row }) => <PaymentStatusCell reservation={row.original} />,
    meta: { title: "Payment Status" }, // Updated meta title
  },
  {
    id: "dateTime", // accessorFn will now combine date and startTime for sorting/filtering
    accessorFn: (row: Reservation) => `${row.date} ${row.startTime}`,
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Date & Time" />
    ),
    cell: ({ row }: { row: Row<Reservation> }) => {
      const { date, startTime, estimatedEventDuration } = row.original;
      const formattedDate = format(new Date(date), "MM-dd-yyyy");

      let displayEndTime = "N/A"; // Default value

      if (
        startTime &&
        estimatedEventDuration !== undefined &&
        estimatedEventDuration !== null
      ) {
        try {
          const datePart = format(new Date(date), "yyyy-MM-dd");
          const dateTimeString = `${datePart} ${startTime}`; // Use parse to create a Date object from the combined string
          // Provide a format string that matches dateTimeString

          const startDateObj = parse(
            dateTimeString,
            "yyyy-MM-dd h:mm a",
            new Date(),
          ); // Use a reference date

          if (!isNaN(startDateObj.getTime())) {
            // Check if parsing was successful
            // Add the estimated duration (assuming in hours)
            const endDateObj = addHours(startDateObj, estimatedEventDuration); // Format the calculated end time

            displayEndTime = format(endDateObj, "h:mm a"); // Format to h:mm AM/PM
          } else {
            console.error(
              "Failed to parse start date or time:",
              dateTimeString,
            );
          }
        } catch (error) {
          console.error("Error calculating end time:", error);
          displayEndTime = "Error"; // Indicate error if calculation fails
        }
      } else if (startTime) {
        // If duration is not available but startTime is, just show the start time
        displayEndTime = "Duration N/A"; // Indicate duration is missing
      }

      return (
        <div className="flex flex-col items-center">
          <div className="font-medium">{formattedDate}</div>{" "}
          <div className="text-xs text-gray-500">
            {startTime} - {displayEndTime} {/* Use the calculated end time */}{" "}
          </div>{" "}
        </div>
      );
    },
    meta: { title: "Date & Time" },
  },

  {
    accessorKey: "eventType",
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Event Type" />
    ),
    cell: ({ getValue }) => {
      const value = getValue<string | undefined>();
      return value || "N/A";
    },
    meta: { title: "Event Type" },
  },
  {
    accessorKey: "partySize",
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Party Size" />
    ),
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return `${value} pax`;
    },
    meta: { title: "Party Size" },
  },

  {
    accessorKey: "paymentMethod",
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Payment Method" />
    ),
    cell: ({ getValue }) => {
      const value = getValue<string | undefined>();
      return value || "N/A";
    },
    meta: { title: "Payment Method" },
  },
  {
    accessorKey: "totalPayment",
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Total" /> // Renamed header
    ),
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return formatCurrency(value); // Use formatCurrency helper
    },
    meta: { title: "Total" }, // Updated meta title
  },
  {
    accessorKey: "balanceDue",
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Balance Due" />
    ),
    cell: ({ getValue, row }) => {
      const balanceDue = getValue<number | undefined>();
      const totalPayment = row.original.totalPayment;
      const showBalanceDue =
        balanceDue != null && balanceDue > 0 && balanceDue !== totalPayment;

      return showBalanceDue ? (
        <span className="font-bold text-orange-700">
          {formatCurrency(balanceDue)}
        </span>
      ) : (
        <span>{formatCurrency(0)}</span> // Display ₱0.00 if no balance due
      );
    },
    meta: { title: "Balance Due" },
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
    accessorFn: (row: Reservation) => row.userId?.email || "No Email",
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
    accessorKey: "specialRequest",
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Special Request" />
    ),
    cell: ({ getValue }) => {
      const value = getValue<string>();
      // Truncate long requests for table display if needed
      return value
        ? value.substring(0, 50) + (value.length > 50 ? "..." : "")
        : "N/A";
    },
    meta: { title: "Special Request" },
  },
  {
    accessorKey: "_id",
    header: "Transaction Id",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return (
        <div className="flex items-center space-x-1">
          <span className="text-xs font-medium text-primary">{value}</span>
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigator.clipboard.writeText(value)}
                  className="cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  <Copy size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Copy Transaction ID</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    meta: { title: "Transaction Id" },
  },
  {
    id: "createdAt", // Changed accessorKey to id to avoid conflict if needed, but keeping accessorKey is fine too
    accessorKey: "createdAt", // Keep accessorKey for sorting/filtering
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ getValue }) => {
      const rawCreatedAt: string = getValue<string>();
      const formattedDate = format(new Date(rawCreatedAt), "MM-dd-yyyy");
      const formattedTime = format(new Date(rawCreatedAt), "h:mm a");
      return (
        <div className="flex flex-col items-center">
          <div className="font-medium">{formattedDate}</div>
          <div className="text-xs text-gray-500">{formattedTime}</div>
        </div>
      );
    },
    meta: { title: "Created At" },
  },
  {
    id: "userId", // Keeping this as id for clarity
    accessorFn: (row: Reservation) => (row.userId ? row.userId._id : "No User"),
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="User Id" />
    ),
    meta: { title: "User Id" },
  },
  {
    id: "actions",
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    enableHiding: false,
    cell: ({ row }) => <EventReservationActions reservation={row.original} />,
    meta: { title: "Actions" },
  },
];
