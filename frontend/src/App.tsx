import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminSidebarLayout from "./app/Layout";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "./components/ui/toaster";
import Reports from "./features/Admin/pages/Reports";
import Login from "./features/Auth/pages/Login";
import Signup from "./features/Auth/pages/Signup";
import useAuthStore from "./features/Auth/stores/useAuthStore";
import EventForm from "./features/Events/pages/EventForm";
import GroupForm from "./features/Events/pages/GroupForm";
import Schedule from "./features/Events/pages/Schedule";
import MenuItem from "./features/Menu/components/MenuItem";
import ManageMenu from "./features/Menu/pages/ManageMenu";
import OrderCheckout from "./features/Menu/pages/OrderCheckout";
import ManageUsers from "./features/Users/pages/ManageUsers";
import About from "./pages/About";
import Blogs from "./pages/Blogs";
import Contacts from "./pages/Contacts";
import Profile from "./pages/Profile";
import Menu from "./features/Menu/pages/Menu";
import Home from "./pages/Home";
import Settings from "./features/Admin/pages/Settings";
import Footer from "./components/Footer";
import AdminDashboard from "./features/Admin/pages/AdminDashboard";
import ManageEvents from "./features/Events/pages/ManageEvents";
import AdminChat from "./features/Chat/components/AdminChat";

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
                <Route path="/schedule" element={<Schedule />} />
                <Route
                  path="/schedule/event-form/:userId"
                  element={<EventForm />}
                />
                <Route path="/schedule/group-form" element={<GroupForm />} />
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
                <Route path="/manage-events" element={<ManageEvents />} />
                <Route path="/admin-chat" element={<AdminChat />} />
              </Routes>
            </AdminSidebarLayout>
          ) : (
            <Routes>
              {/* Regular Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route
                path="/schedule/event-form/:userId"
                element={<EventForm />}
              />
              <Route path="/schedule/group-form" element={<GroupForm />} />
              <Route path="/menu" element={<Menu />} />
              <Route
                path="/menu/categories/:categoryId/subcategories/:subcategoryId"
                element={<Menu />}
              />
              <Route path="/menu/order-checkout" element={<OrderCheckout />} />
              <Route path="/menu/:menuItemId" element={<MenuItem />} />
              <Route path="/contacts" element={<Contacts />} />
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
