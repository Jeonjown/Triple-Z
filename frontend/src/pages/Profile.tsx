import { useState } from "react";
import Cancelled from "@/components/Cancelled";
import MySchedule from "@/components/MySchedule";
import ScheduleHistory from "@/components/ScheduleHistory";
import useAuthStore from "@/features/Auth/stores/useAuthStore";
import { CircleUserRound } from "lucide-react";

const Profile = () => {
  const { user } = useAuthStore();

  // State for managing the active tab. Default tab is "My Schedule".
  const [activeTab, setActiveTab] = useState("myschedule");

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-2 sm:px-4 md:px-6 lg:px-8">
      {/* Header Section */}
      <div className="relative h-24 w-full bg-primary sm:h-28 md:h-32"></div>

      {/* Profile Info */}
      <div className="border px-3 py-3 sm:px-4 sm:py-4 md:px-5">
        <div className="relative flex flex-col items-center">
          {/* Responsive icon size: smaller on mobile, larger on desktop */}
          <CircleUserRound className="absolute -top-8 h-14 w-14 rounded-full bg-white p-1 shadow-md sm:-top-10 sm:h-16 sm:w-16 md:h-20 md:w-20" />
          {/* Adjusted text size for responsiveness */}
          <h3 className="mt-10 text-lg font-semibold sm:mt-12 sm:text-xl md:text-2xl">
            {user?.username}
          </h3>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-4 w-full border sm:mt-6 md:mt-8">
        <div className="bg-muted">
          <ul className="xs:space-x-3 flex flex-wrap justify-center space-x-2 px-2 py-2 text-sm font-medium text-text sm:space-x-4 sm:px-4 sm:py-3 sm:text-base md:space-x-8 md:px-5 md:text-lg lg:space-x-12 lg:px-8 xl:px-20">
            <li
              className={`cursor-pointer whitespace-nowrap px-1 py-1 ${
                activeTab === "myschedule"
                  ? "border-b-2 border-primary text-primary"
                  : ""
              }`}
              onClick={() => setActiveTab("myschedule")}
            >
              My Schedule
            </li>
            <li
              className={`cursor-pointer whitespace-nowrap px-1 py-1 ${
                activeTab === "schedulehistory"
                  ? "border-b-2 border-primary text-primary"
                  : ""
              }`}
              onClick={() => setActiveTab("schedulehistory")}
            >
              Schedule History
            </li>
            <li
              className={`cursor-pointer whitespace-nowrap px-1 py-1 ${
                activeTab === "cancelled"
                  ? "border-b-2 border-primary text-primary"
                  : ""
              }`}
              onClick={() => setActiveTab("cancelled")}
            >
              Cancelled
            </li>
          </ul>
        </div>

        {/* Tab Content */}
        <div className="p-2 sm:p-3 md:p-5">
          {activeTab === "myschedule" && <MySchedule />}
          {activeTab === "schedulehistory" && <ScheduleHistory />}
          {activeTab === "cancelled" && <Cancelled />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
