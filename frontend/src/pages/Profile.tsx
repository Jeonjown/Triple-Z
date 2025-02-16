import { CircleUserRound } from "lucide-react";

const Profile = () => {
  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl md:border">
      {/* Header Section */}
      <div className="relative h-32 bg-primary"></div>

      {/* Profile Info */}
      <div className="px-5">
        <div className="relative flex flex-col items-center">
          {/* Profile Image */}
          <CircleUserRound className="absolute -top-10 size-20 rounded-full bg-white p-1 shadow-md" />
          <h3 className="mt-12 text-lg font-semibold">Malaking Kid (Kid)</h3>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-4 w-full bg-gray-100">
        <ul className="flex flex-wrap justify-between gap-2 px-5 py-3 text-sm font-medium text-gray-600 lg:px-20">
          <li className="border-b-2 border-black pb-2 text-black">Schedule</li>
          <li>History</li>
          <li>Cancelled</li>
          <li>Favorites</li>
          <li>Notifications</li>
        </ul>
      </div>

      {/* Schedule and Pre-ordered Menu */}
      <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
        {/* Schedule Details */}
        <div>
          <h2 className="text-lg font-semibold">Schedule Details</h2>
          <div className="mt-3 space-y-3 text-sm">
            <div>
              <span className="text-gray-500">Date</span>
              <p className="flex items-center gap-2 font-semibold">
                📅 15 November 2024 at 1:00 PM
              </p>
            </div>
            <div>
              <span className="text-gray-500">Event Type</span>
              <p className="font-semibold">Christmas Party</p>
            </div>
            <div>
              <span className="text-gray-500">Party Size</span>
              <p className="font-semibold">22 packs</p>
            </div>
          </div>
        </div>

        {/* Pre-ordered Menu */}
        <div>
          <h3 className="text-md font-semibold">Pre-ordered Menu</h3>
          <div className="mt-3 space-y-3">
            <div className="rounded-lg bg-gray-100 p-3">
              <p className="flex justify-between font-semibold">
                <span>Merienda Budgetarian</span> <span>₱2700.00</span>
              </p>
              <p className="text-sm text-gray-600">
                18 Shawarma
                <br />
                18 16oz Lava Drink or Soda Blast
              </p>
            </div>
            <div className="rounded-lg bg-gray-100 p-3">
              <p className="flex justify-between font-semibold">
                <span>Additionals</span> <span>₱1260.00</span>
              </p>
              <p className="text-sm text-gray-600">18 Shawarma</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
