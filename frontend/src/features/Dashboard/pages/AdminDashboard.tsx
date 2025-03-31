import ReservationAnalytics from "../components/ReservationAnalytics";
import ReservationCalendar from "../components/ReservationCalendar";
import UserAnalytics from "../components/UserAnalytics";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-white p-5">
      {/* Dashboard Header */}
      <div className="mb-10 mt-5">
        <h2 className="text-3xl font-extrabold">Dashboard</h2>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 gap-8">
        <ReservationAnalytics />
        <ReservationCalendar />
        <UserAnalytics />
      </div>
    </div>
  );
};

export default AdminDashboard;
