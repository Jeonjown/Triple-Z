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

// Dummy stats (replace these with API calls in a real app)
const totalUsers = 1234;
const totalReservations = 567;
const monthlyRevenue = 12345;

// Dummy user data (replace with API-fetched data)
const userData = [
  { month: "January", users: 100 },
  { month: "February", users: 200 },
  { month: "March", users: 150 },
  { month: "April", users: 250 },
  { month: "May", users: 300 },
  { month: "June", users: 350 },
];

const UserAnalytics = () => {
  return (
    <>
      {/* Stat Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-muted p-5 shadow">
          <h3 className="text-xl font-bold">Total Users</h3>
          <p className="mt-2 text-3xl">{totalUsers}</p>
        </div>
        <div className="rounded-lg border bg-muted p-5 shadow">
          <h3 className="text-xl font-bold">Total Reservations</h3>
          <p className="mt-2 text-3xl">{totalReservations}</p>
        </div>
        <div className="rounded-lg border bg-muted p-5 shadow">
          <h3 className="text-xl font-bold">Monthly Revenue</h3>
          <p className="mt-2 text-3xl">${monthlyRevenue}</p>
        </div>
      </div>
      <Card className="bg-muted">
        <CardHeader>
          <CardTitle>Monthly Users</CardTitle>
          <CardDescription>Users per month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <Tooltip />
              <Bar dataKey="users" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground">
            Data from January to June 2024
          </p>
        </CardFooter>
      </Card>
    </>
  );
};

export default UserAnalytics;
