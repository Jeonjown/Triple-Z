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
    <div className="mx-auto min-h-screen w-full max-w-5xl">
      {/* Header Section */}
      <div className="relative h-32 bg-primary"></div>

      {/* Profile Info */}
      <div className="border px-5 py-4">
        <div className="relative flex flex-col items-center">
          <CircleUserRound className="absolute -top-10 h-20 w-20 rounded-full bg-white p-1 shadow-md" />
          <h3 className="mt-12 text-2xl font-semibold">{user?.username}</h3>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-8 w-full border">
        <div className="bg-muted">
          <ul className="flex flex-wrap justify-center space-x-12 px-5 py-3 text-lg font-medium text-text lg:px-20">
            <li
              className={`cursor-pointer ${
                activeTab === "myschedule"
                  ? "border-b-2 border-primary text-primary"
                  : ""
              }`}
              onClick={() => setActiveTab("myschedule")}
            >
              My Schedule
            </li>
            <li
              className={`cursor-pointer ${
                activeTab === "schedulehistory"
                  ? "border-b-2 border-primary text-primary"
                  : ""
              }`}
              onClick={() => setActiveTab("schedulehistory")}
            >
              Schedule History
            </li>
            <li
              className={`cursor-pointer ${
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
        <div className="p-5">
          {activeTab === "myschedule" && <MySchedule />}
          {activeTab === "schedulehistory" && <ScheduleHistory />}
          {activeTab === "cancelled" && <Cancelled />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
