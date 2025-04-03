// App.tsx
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your layouts, pages, hooks, etc.
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
import Blogs from "./features/Blogs/pages/Blogs";
import Contacts from "./pages/Contacts";
import Profile from "./pages/Profile";
import Menu from "./features/Menu/pages/Menu";
import Home from "./pages/Home";
import Settings from "./features/Admin/pages/Settings";
import Footer from "./components/Footer";
import AdminDashboard from "./features/Dashboard/pages/AdminDashboard";
import ManageEvents from "./features/Events/pages/ManageEvents";
import AdminChat from "./features/Chat/components/AdminChat";
import ManageGroups from "./features/Events/pages/ManageGroups";
import ManageBlogs from "./features/Blogs/pages/ManageBlogs";
import BlogPosts from "./features/Blogs/pages/BlogPosts";
import AdminBlog from "./features/Blogs/pages/AdminBlog";
import { useFCMToken } from "./features/Notifications/push-notification/useFCMToken";
import GenerateReceipt from "./features/Menu/pages/GenerateReceipt";
import ReceiptPage from "./features/Menu/pages/ReceiptPage";
import ResetPassword from "./features/Auth/components/ResetPassword ";
import ForgotPassword from "./features/Auth/components/ForgotPassword";

function App(): JSX.Element {
  // Retrieve authenticated user info from your store.
  // This might be a user object or null.
  const { user } = useAuthStore();
  const isAdmin: boolean = user?.role === "admin";

  // Call the hook using optional chaining.
  const { requestToken } = useFCMToken(
    user?._id,
    user?.role as "admin" | "user" | undefined,
  );

  useEffect(() => {
    if (user?._id && (user.role === "admin" || user.role === "user")) {
      requestToken();
    }
  }, [user, requestToken]);
  // Listen for background notifications via BroadcastChannel.
  useEffect(() => {
    const channel = new BroadcastChannel("notification_channel");
    channel.onmessage = (event: MessageEvent<{ key: unknown }>) => {
      console.log("Received background notification:", event.data);
      const audio = new Audio("/notification-sound.mp3");
      audio
        .play()
        .catch((error: Error) => console.error("Audio play failed:", error));
    };
    return () => channel.close();
  }, []);

  // Define common routes for all users.
  const commonRoutes = (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/schedule/event-form/:userId" element={<EventForm />} />
      <Route path="/schedule/group-form" element={<GroupForm />} />
      <Route path="/schedule/group-form/:userId" element={<GroupForm />} />
      <Route path="/menu" element={<Menu />} />
      <Route
        path="/menu/categories/:categoryId/subcategories/:subcategoryId"
        element={<Menu />}
      />
      <Route path="/menu/:menuItemId" element={<MenuItem />} />
      <Route path="/menu/order-checkout" element={<OrderCheckout />} />
      <Route path="/menu/generate-receipt" element={<GenerateReceipt />} />
      <Route path="/menu/receipt-page" element={<ReceiptPage />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/blogs/:id" element={<BlogPosts />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </>
  );

  // Define admin-only routes.
  const adminRoutes = (
    <>
      <Route path="/admin/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin/manage-users" element={<ManageUsers />} />
      <Route path="/admin/settings" element={<Settings />} />
      <Route path="/admin/reports" element={<Reports />} />
      <Route path="/admin/manage-menu" element={<ManageMenu />} />
      <Route path="/admin/manage-events" element={<ManageEvents />} />
      <Route path="/admin/manage-blogs" element={<ManageBlogs />} />
      <Route path="/admin/manage-blogs/:id" element={<AdminBlog />} />
      <Route path="/admin/manage-groups" element={<ManageGroups />} />
      <Route path="/admin/admin-chat" element={<AdminChat />} />
    </>
  );

  return (
    <Router>
      <ScrollToTop />
      <main className="mb-20 mt-24 flex min-h-screen w-full flex-col">
        <Toaster />
        <Navbar />
        <div className="flex-grow">
          {isAdmin ? (
            // For admin users, wrap routes inside AdminSidebarLayout.
            <AdminSidebarLayout>
              <Routes>
                {commonRoutes}
                {adminRoutes}
              </Routes>
            </AdminSidebarLayout>
          ) : (
            // For non-admin users, use common routes only.
            <Routes>{commonRoutes}</Routes>
          )}
        </div>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
