// src/components/ReservationStatusSummary.tsx

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClockAlert, HandCoins, PiggyBank } from "lucide-react";
import { Link } from "react-router-dom";
import { useFetchReservationStats } from "../hooks/useFetchReservationStats"; // Import the custom hook

const ReservationStatusSummary: React.FC = () => {
  // Use the custom hook to fetch dynamic reservation stats
  const { data, isLoading, isError, error } = useFetchReservationStats();

  // Handle loading state
  if (isLoading) {
    return <div>Loading reservation stats...</div>;
  }

  // Handle error state
  if (isError) {
    return <div>Error fetching stats: {error?.message}</div>;
  }

  // Ensure data exists before destructuring it
  const eventStats = data?.eventStats || {
    pending: 0,
    notPaid: 0,
    partiallyPaid: 0,
  };
  const groupStats = data?.groupStats || { pending: 0, notPaid: 0 };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Event Reservations Stats Card */}
      <Link to="/admin/manage-events" className="h-full">
        <Card className="flex h-full flex-col rounded-lg bg-muted hover:scale-105">
          <CardHeader className="rounded-t-lg bg-primary p-4 text-white">
            <CardTitle className="text-2xl font-bold">
              Event Reservations
            </CardTitle>
            <CardDescription className="text-sm text-white">
              Events status totals
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-center p-6">
            <ul className="flex flex-col justify-evenly space-y-3 text-xl lg:flex-row lg:space-x-6 lg:space-y-0">
              <li className="flex items-center">
                <ClockAlert className="mr-2 text-primary" />
                <span className="mr-1 font-semibold">Pending: </span>
                {eventStats.pending}
              </li>
              <li className="flex items-center">
                <HandCoins className="mr-2 text-red-500" />
                <span className="mr-1 font-semibold">Not Paid: </span>
                {eventStats.notPaid}
              </li>
              <li className="flex items-center">
                <PiggyBank className="mr-2 text-green-500" />
                <span className="mr-1 font-semibold">Partially Paid: </span>
                {eventStats.partiallyPaid}
              </li>
            </ul>
          </CardContent>
        </Card>
      </Link>

      {/* Group Reservations Stats Card */}
      <Link to="/admin/manage-groups" className="h-full">
        <Card className="flex h-full flex-col rounded-lg bg-muted hover:scale-105">
          <CardHeader className="rounded-t-lg bg-primary p-4 text-white">
            <CardTitle className="text-2xl font-bold">
              Group Reservations
            </CardTitle>
            <CardDescription className="text-sm text-white">
              Group status totals
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-center p-6">
            <ul className="flex flex-col justify-evenly space-y-3 text-xl lg:flex-row lg:space-x-6 lg:space-y-0">
              <li className="flex items-center">
                <ClockAlert className="mr-2 text-primary" />
                <span className="mr-2 font-semibold">Pending: </span>
                {groupStats.pending}
              </li>
              <li className="flex items-center">
                <HandCoins className="mr-1 text-green-500" />
                <span className="mr-1 font-semibold">Not Paid: </span>
                {groupStats.notPaid}
              </li>
            </ul>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default ReservationStatusSummary;
