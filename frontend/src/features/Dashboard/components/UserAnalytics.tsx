import { useFetchReservationTotals } from "../hooks/useFetchReservationTotals";
import { useFetchTotalUsers } from "../hooks/useFetchTotalUsers";
import { useFetchMonthlyUsers } from "../hooks/useFetchMonthlyUsers";

import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

const UserAnalytics = () => {
  // Fetch data using custom hooks
  const { data: totalUsers } = useFetchTotalUsers();
  const { data: monthlyUsers, isPending: monthlyLoading } =
    useFetchMonthlyUsers();
  const {
    data: reservationData,
    isPending,
    isError,
  } = useFetchReservationTotals();

  const totalReservations = reservationData ? reservationData.combinedTotal : 0;

  return (
    <>
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-muted p-5 shadow">
          <h3 className="text-xl font-bold">Total Users</h3>
          <p className="mt-2 text-3xl">{totalUsers}</p>
        </div>
        <div className="rounded-lg border bg-muted p-5 shadow">
          <h3 className="text-xl font-bold">Total Reservations</h3>
          <p className="mt-2 text-3xl">
            {isPending ? "Loading..." : isError ? "Error" : totalReservations}
          </p>
        </div>
        <div className="rounded-lg border bg-muted p-5 shadow">
          <h3 className="text-xl font-bold">New Users This Month:</h3>
          <p className="mt-2 text-3xl">
            {monthlyLoading
              ? "Loading..."
              : monthlyUsers && monthlyUsers.length > 0
                ? monthlyUsers[monthlyUsers.length - 1].count
                : "0"}
          </p>
        </div>
      </div>
      <Card className="bg-muted">
        <CardHeader>
          <CardTitle>Monthly Users</CardTitle>
          <CardDescription>Users per month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyUsers || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground">Data from the past few months</p>
        </CardFooter>
      </Card>
    </>
  );
};

export default UserAnalytics;
