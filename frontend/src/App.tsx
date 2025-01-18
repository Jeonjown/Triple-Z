import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Events from "./pages/Events";
import Menu from "./pages/Menu";
import Contacts from "./pages/Contacts";
import Schedule from "./features/scheduling/pages/Schedule";
import Blogs from "./pages/Blogs";
import MyAccount from "./pages/MyAccount";
import Footer from "./components/Footer";
import Signup from "./features/auth/pages/Signup";
import Login from "./features/auth/pages/Login";
import AdminSidebar from "./components/admin/AdminSidebar";
import useAuthStore from "./features/auth/stores/useAuthStore";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import Settings from "./pages/admin/Settings";
import Reports from "./pages/admin/Reports";
import ManageMenu from "./pages/admin/ManageMenu";

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Navbar />
      <div className="flex">
        {user && user.role === "admin" && <AdminSidebar />}

        <div
          className={`flex-1 py-20 ${user && user.role === "admin" ? "ml-10" : ""}`}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            {/* admin */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/manage-menu" element={<ManageMenu />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
