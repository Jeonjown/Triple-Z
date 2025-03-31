import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClockAlert, HandCoins, PiggyBank } from "lucide-react";
import { Link } from "react-router-dom";

const ReservationStatusSummary = () => {
  // Dummy data; replace these values with actual API data.
  const eventStats = {
    pending: 12,
    notPaid: 5,
    partiallyPaid: 3,
  };

  const groupStats = {
    pending: 7,
    notPaid: 2,
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Event Reservations Stats Card */}
      <Link to={"/admin/manage-events"} className="h-full">
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
      <Link to={"/admin/manage-groups"} className="h-full">
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
