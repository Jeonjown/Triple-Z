import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Events from "./pages/Events";
import Contacts from "./pages/Contacts";
import Schedule from "./features/Events/pages/Schedule";
import Blogs from "./pages/Blogs";

import Footer from "./components/Footer";
import Signup from "./features/Auth/pages/Signup";
import Login from "./features/Auth/pages/Login";
import useAuthStore from "./features/Auth/stores/useAuthStore";
import AdminDashboard from "./features/Admin/pages/AdminDashboard";
import Settings from "./features/Admin/pages/Settings";
import Reports from "./features/Admin/pages/Reports";

import ManageMenu from "./features/Menu/pages/ManageMenu";
import AdminSidebarLayout from "./app/Layout";
import Menu from "./features/Menu/pages/Menu";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "./components/ui/toaster";
import OrderCheckout from "./features/Menu/pages/OrderCheckout";
import Profile from "./pages/Profile";
import MenuItem from "./features/Menu/components/MenuItem";
import ManageUsers from "./features/Users/pages/ManageUsers";

function App() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  return (
    <Router>
      <ScrollToTop />
      <main className="mt-24 flex min-h-[200vh] w-full flex-col">
        <Toaster />
        <Navbar />
        <div className="flex-grow">
          {isAdmin ? (
            <AdminSidebarLayout>
              <Routes>
                {/* Regular Routes */}

                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/events" element={<Events />} />
                <Route path="/menu" element={<Menu />} />
                <Route
                  path="/menu/categories/:categoryId/subcategories/:subcategoryId"
                  element={<Menu />}
                />
                <Route path="/menu/:menuItemId" element={<MenuItem />} />
                <Route
                  path="/menu/order-checkout"
                  element={<OrderCheckout />}
                />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />

                {/* Admin Routes */}
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/manage-users" element={<ManageUsers />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/manage-menu" element={<ManageMenu />} />
              </Routes>
            </AdminSidebarLayout>
          ) : (
            <Routes>
              {/* Regular Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events />} />
              <Route path="/menu" element={<Menu />} />
              <Route
                path="/menu/categories/:categoryId/subcategories/:subcategoryId"
                element={<Menu />}
              />
              <Route path="/menu/order-checkout" element={<OrderCheckout />} />
              <Route path="/menu/:menuItemId" element={<MenuItem />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          )}
        </div>

        <Footer />
      </main>
    </Router>
  );
}

export default App;
