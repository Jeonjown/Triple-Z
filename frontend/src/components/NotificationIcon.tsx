import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { FaBell } from "react-icons/fa";
import useAuthStore from "@/features/Auth/stores/useAuthStore";
import { useNotifications } from "@/notifications/hooks/useNotification";

const NotificationIcon = () => {
  // Get the user from your auth store
  const { user } = useAuthStore();
  // Pass the user ID directly (if available) to your hook
  const {
    data: notifications,
    isLoading,
    error,
  } = useNotifications(user?._id || "");

  return (
    <div className="relative ml-auto gap-2 md:flex">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <FaBell size={28} className="text-icon hover:scale-105" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-2">
          <DropdownMenuLabel className="font-bold">
            NOTIFICATIONS
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isLoading ? (
            <DropdownMenuItem>Loading notifications...</DropdownMenuItem>
          ) : error ? (
            <DropdownMenuItem>Error loading notifications</DropdownMenuItem>
          ) : notifications && notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem key={notification._id}>
                <div>
                  <strong>{notification.title}</strong>
                  <p>{notification.description}</p>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem>No notifications found</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotificationIcon;
