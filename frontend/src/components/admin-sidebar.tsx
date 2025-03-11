import {
  Calendar,
  LayoutDashboard,
  UsersRound,
  Settings,
  X,
  MessageCircle,
  ChevronRight,
  CalendarDays,
  Images,
  Coffee,
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

// Import Dropdown components
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function AppAdminSidebar() {
  const { open, isMobile, toggleSidebar } = useSidebar();
  // Define collapsed state: when sidebar is not open and not on mobile.
  const isCollapsed = !open && !isMobile;

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
                    className="flex w-full items-center gap-2 rounded p-2 hover:bg-muted"
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
                    className="flex w-full items-center gap-2 rounded p-2 hover:bg-muted"
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
                <SidebarMenuButton asChild className="[&>svg]:size-6">
                  <Link
                    to="/manage-menu"
                    className="flex w-full items-center gap-2 rounded p-2 hover:bg-muted"
                  >
                    <Coffee />
                    <span className="text-base font-semibold">Manage Menu</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="[&>svg]:size-5">
                  <Link
                    to="/manage-blogs"
                    className="flex w-full items-center gap-2 rounded p-2 hover:bg-muted"
                  >
                    <Images />
                    <span className="text-base font-semibold">
                      Manage Blogs
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Manage Events with sub-items */}
              <SidebarMenuItem>
                {isCollapsed ? (
                  // Render dropdown when sidebar is collapsed on desktop.
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton className="[&>svg]:size-6">
                        <div className="flex items-center justify-between gap-2 rounded">
                          <div className="flex items-center gap-2">
                            <Calendar className="size-5" />
                          </div>
                          <span className="text-base font-semibold">
                            Manage Events
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                      <DropdownMenuLabel>Manage Events</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <Link
                            to="/manage-groups"
                            className="flex w-full items-center gap-2 rounded"
                          >
                            <UsersRound className="!size-5" />
                            <span className="text-base font-semibold">
                              Groups
                            </span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            to="/manage-events"
                            className="flex w-full items-center gap-2 rounded"
                          >
                            <CalendarDays className="!size-5" />
                            <span className="text-base font-semibold">
                              Events
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  // Render collapsible when sidebar is expanded or on mobile.
                  <Collapsible defaultOpen className="group">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="[&>svg]:size-6">
                        <div className="flex items-center justify-between gap-2 rounded">
                          <div className="flex items-center gap-2">
                            <Calendar className="size-5" />
                          </div>
                          <span className="text-base font-semibold">
                            Manage Events
                          </span>
                          <ChevronRight className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-1">
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <Link
                            to="/manage-groups"
                            className="flex w-full items-center gap-2 rounded p-1 hover:bg-muted"
                          >
                            <UsersRound className="!size-5" />
                            <span className="text-base font-semibold">
                              Groups
                            </span>
                          </Link>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <Link
                            to="/manage-events"
                            className="flex w-full items-center gap-2 rounded p-1 hover:bg-muted"
                          >
                            <CalendarDays className="!size-5" />
                            <span className="text-base font-semibold">
                              Events
                            </span>
                          </Link>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </SidebarMenuItem>

              {/* Admin Chat */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="[&>svg]:size-5">
                  <Link
                    to="/admin-chat"
                    className="flex w-full items-center gap-2 rounded p-2"
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
                    className="flex w-full items-center gap-2 rounded p-2"
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
