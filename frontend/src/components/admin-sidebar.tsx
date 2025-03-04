import {
  Calendar,
  LayoutDashboard,
  UsersRound,
  Settings,
  Pizza,
  X,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  CalendarDays,
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

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
        <SidebarGroup>
          <SidebarGroupLabel>Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="[&>svg]:size-5">
                  <Link
                    to="#"
                    className="flex items-center gap-2 rounded p-2 hover:bg-gray-200"
                  >
                    <LayoutDashboard />
                    <span className="text-base font-semibold">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Manage Users */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="[&>svg]:size-5">
                  <Link
                    to="/manage-users"
                    className="flex items-center gap-2 rounded p-2 hover:bg-gray-200"
                  >
                    <UsersRound />
                    <span className="text-base font-semibold">
                      Manage Users
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Manage Menu */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="[&>svg]:size-5">
                  <Link
                    to="/manage-menu"
                    className="flex items-center gap-2 rounded p-2 hover:bg-gray-200"
                  >
                    <Pizza />
                    <span className="text-base font-semibold">Manage Menu</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Manage Events with sub-items */}
              <SidebarMenuItem>
                <Collapsible defaultOpen className="group">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="[&>svg]:size-5">
                      <div className="flex items-center justify-between gap-2 rounded">
                        {/* Left side: Icon and label */}
                        <div className="flex items-center gap-2">
                          <Calendar />
                          <span className="text-base font-semibold">
                            Manage Events
                          </span>
                        </div>
                        <ChevronRight className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {/* Groups sub-item */}
                      <SidebarMenuSubItem>
                        <Link
                          to="/manage-groups"
                          className="flex items-center gap-2 rounded p-2 hover:bg-gray-200"
                        >
                          <UsersRound /> {/* Change icon if needed */}
                          <span className="text-base font-semibold">
                            Groups
                          </span>
                        </Link>
                      </SidebarMenuSubItem>
                      {/* Events sub-item */}
                      <SidebarMenuSubItem>
                        <Link
                          to="/manage-events"
                          className="flex items-center gap-2 rounded p-2 hover:bg-gray-200"
                        >
                          <CalendarDays />
                          <span className="text-base font-semibold">
                            Events
                          </span>
                        </Link>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              {/* Admin Chat */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="[&>svg]:size-5">
                  <Link
                    to="/admin-chat"
                    className="flex items-center gap-2 rounded p-2 hover:bg-gray-200"
                  >
                    <MessageCircle />
                    <span className="text-base font-semibold">Admin Chat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Settings */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="[&>svg]:size-5">
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 rounded p-2 hover:bg-gray-200"
                  >
                    <Settings />
                    <span className="text-base font-semibold">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
