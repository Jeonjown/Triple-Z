import { AppAdminSidebar } from "@/components/admin-sidebar";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function AdminSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width-icon": "50px",
        } as React.CSSProperties
      }
    >
      {/* Sidebar Component */}
      <Toaster />
      <AppAdminSidebar />
      <SidebarTrigger className="fixed top-24 z-50 md:hidden" />
      {/* Main Content */}
      <div className="mt-24 w-full">{children}</div>
    </SidebarProvider>
  );
}
