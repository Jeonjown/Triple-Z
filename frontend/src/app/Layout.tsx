import { AppAdminSidebar } from "@/components/admin-sidebar";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

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

      <AppAdminSidebar />
      <SidebarTrigger className="fixed top-40 z-50 md:hidden" />
      {/* Main Content */}
      <div className="w-full">{children}</div>
    </SidebarProvider>
  );
}
