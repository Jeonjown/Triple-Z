import {
  Calendar,
  LayoutDashboard,
  UsersRound,
  Settings,
  Pizza,
  X,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

// Define Sidebar Menu Items
const items = [
  { title: "Dashboard", url: "#", icon: LayoutDashboard },
  { title: "Manage Users", url: "/manage-users", icon: UsersRound },
  { title: "Manage Menu", url: "/manage-menu", icon: Pizza },
  { title: "Manage Events", url: "#", icon: Calendar },
  { title: "Settings", url: "#", icon: Settings },
];

export function AppAdminSidebar() {
  const { open, isMobile, toggleSidebar } = useSidebar();
  return (
    <Sidebar variant="floating" collapsible="icon" className="mt-24">
      <SidebarTrigger className="absolute -right-7 hidden md:flex" />

      <SidebarHeader className="mt-5">
        {open && (
          <div className="flex px-5">
            <span className="text-lg font-bold">Admin Dashboard</span>
            {isMobile && (
              <X
                className="ml-auto cursor-pointer md:hidden"
                onClick={toggleSidebar}
              />
            )}
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Sidebar Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(({ title, url, icon: Icon }) => (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton asChild className="[&>svg]:size-5">
                    <Link
                      to={url}
                      className="flex items-center gap-2 rounded p-2 hover:bg-gray-200"
                    >
                      <Icon />
                      <span className="text-base font-semibold">{title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
