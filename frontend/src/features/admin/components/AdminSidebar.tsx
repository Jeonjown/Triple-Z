import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="fixed top-24 z-10 hidden min-h-screen w-64 border-2 bg-white md:block">
      {/* Sidebar */}
      <aside className="flex flex-col font-semibold text-text">
        {/* Logo Section */}
        <div className="bg-secondary">
          <div className="flex h-16 items-center justify-center text-xl font-bold text-white">
            Admin Panel
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            <li className="flex items-center gap-4 rounded-md p-2 hover:bg-primary">
              <span className="text-xl">🏠</span>
              <Link to={"/admin-dashboard"}>Dashboard</Link>
            </li>
            <li className="flex items-center gap-4 rounded-md p-2 hover:bg-primary">
              <span className="text-xl">👥</span>
              <Link to={"/manage-users"}>Manage Users</Link>
            </li>
            <li className="flex items-center gap-4 rounded-md p-2 hover:bg-primary">
              <span className="text-xl">🍔</span>
              <Link to={"/manage-menu"}>Manage Menu</Link>
            </li>
            <li className="flex items-center gap-4 rounded-md p-2 hover:bg-primary">
              <span className="text-xl">📊</span>
              <Link to={"/reports"}>Reports</Link>
            </li>
            <li className="flex items-center gap-4 rounded-md p-2 hover:bg-primary">
              <span className="text-xl">⚙️</span>
              <Link to={"/settings"}>Settings</Link>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default AdminSidebar;
