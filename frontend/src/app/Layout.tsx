import { AppAdminSidebar } from "@/components/admin-sidebar";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      {/* Sidebar Component */}
      <AppAdminSidebar />
      <SidebarTrigger className="absolute top-24 md:hidden" />
      {/* Main Content */}
      <div className="mt-24 w-full">{children}</div>
    </SidebarProvider>
  );
}
