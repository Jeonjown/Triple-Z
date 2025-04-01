import { useFetchReservationStats } from "../hooks/useFetchReservationStats";
import { useFetchReservationTotals } from "../hooks/useFetchReservationTotals";
import { useFetchTotalUsers } from "../hooks/useFetchTotalUsers";
import { useFetchMonthlyUsers } from "../hooks/useFetchMonthlyUsers";

import { Download } from "lucide-react"; // Download icon

import ReservationAnalytics from "../components/TotalReservationStats";
import ReservationCalendar from "../components/ReservationCalendar";
import UserAnalytics from "../components/UserAnalytics";
import { generateReport } from "@/utils/generateReport";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const {
    data: reservationTotals,
    isPending: isLoadingTotals,
    isError: isErrorTotals,
  } = useFetchReservationTotals();
  const {
    data: reservationStats,
    isPending: isLoadingStats,
    isError: isErrorStats,
  } = useFetchReservationStats();
  const {
    data: totalUsers,
    isPending: isLoadingTotalUsers,
    isError: isErrorTotalUsers,
  } = useFetchTotalUsers();
  const {
    data: monthlyUsers,
    isPending: isLoadingMonthlyUsers,
    isError: isErrorMonthlyUsers,
  } = useFetchMonthlyUsers();

  // Handle the report download
  const handleDownloadReport = () => {
    if (
      reservationTotals &&
      reservationStats &&
      totalUsers !== undefined &&
      monthlyUsers
    ) {
      generateReport(
        reservationTotals,
        reservationStats,
        totalUsers,
        monthlyUsers,
      );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mb-10 mt-5 flex items-center justify-between">
        <h2 className="text-3xl font-extrabold">Dashboard</h2>

        {/* Show download button only when all data is available */}
        {!(
          isLoadingTotals ||
          isLoadingStats ||
          isLoadingTotalUsers ||
          isLoadingMonthlyUsers
        ) && (
          <Button onClick={handleDownloadReport} className="">
            <Download className="mr-2" />
            Download Report
          </Button>
        )}

        {/* Show loading spinner if any data is loading */}
        {(isLoadingTotals ||
          isLoadingStats ||
          isLoadingTotalUsers ||
          isLoadingMonthlyUsers) && <div>Loading data...</div>}

        {/* Show error message if any data fetching failed */}
        {(isErrorTotals ||
          isErrorStats ||
          isErrorTotalUsers ||
          isErrorMonthlyUsers) && <div>Error fetching data</div>}
      </div>

      {/* Analytics content */}
      <div className="grid grid-cols-1 gap-8">
        <ReservationAnalytics />
        <ReservationCalendar />
        <UserAnalytics />
      </div>
    </div>
  );
};

export default AdminDashboard;
