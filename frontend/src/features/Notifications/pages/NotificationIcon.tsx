// src/components/NotificationIcon.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { FaBell } from "react-icons/fa";
import useAuthStore from "@/features/Auth/stores/useAuthStore";
import { useNavigate } from "react-router-dom";

import {
  useNotificationReceiver,
  MyNotification,
} from "@/features/Notifications/hooks/useNotificationReceiver";
import { useNotifications } from "@/features/Notifications/hooks/useNotification";
import { useMarkNotificationAsRead } from "@/features/Notifications/hooks/useMarkNotificationasRead";

const NotificationIcon = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleRedirect = (redirectUrl: string) => {
    if (redirectUrl) {
      navigate(redirectUrl);
    }
  };

  // Fetch initial notifications for the user.
  const {
    data: initialNotifications,
    isPending,
    error,
  } = useNotifications(user?._id || "");

  // Use the realtime hook to combine initial notifications with updates.
  // Cast initialNotifications as MyNotification[] if necessary.
  const { notifications, setNotifications } = useNotificationReceiver(
    user?._id || "",
    (initialNotifications as MyNotification[]) || [],
  );

  // Filter the notifications to show only unread ones.
  const unreadNotifications = notifications.filter((n) => !n.read);
  const unreadCount = unreadNotifications.length;

  // Get the mutation hook for marking a notification as read.
  const { mutate: markAsRead, isPending: isPendingMarkAsRead } =
    useMarkNotificationAsRead();

  // Handler for marking a notification as read.
  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId, {
      onSuccess: () => {
        // Remove the notification from local state after it is marked as read.
        setNotifications((prev) =>
          prev.filter((n) => n._id !== notificationId),
        );
      },
    });
  };

  return (
    <div className="relative ml-auto gap-2 md:flex">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="relative">
          <FaBell size={28} className="text-icon hover:scale-105" />
          {unreadCount > 0 && (
            <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-2">
          {[
            <DropdownMenuLabel key="label" className="font-bold">
              NOTIFICATIONS
            </DropdownMenuLabel>,
            <DropdownMenuSeparator key="separator" />,
            isPending ? (
              <DropdownMenuItem key="loading">
                Loading notifications...
              </DropdownMenuItem>
            ) : error ? (
              <DropdownMenuItem key="error">
                Error loading notifications
              </DropdownMenuItem>
            ) : unreadNotifications.length > 0 ? (
              unreadNotifications.map((notification: MyNotification) => (
                <DropdownMenuItem
                  key={notification._id}
                  className="hover:cursor-pointer"
                  onClick={() => handleRedirect(notification.redirectUrl)}
                >
                  <div>
                    <strong>{notification.title}</strong>
                    <p>{notification.description}</p>
                    <button
                      onClick={(e) => {
                        // Prevent the click event from bubbling up to the DropdownMenuItem
                        e.stopPropagation();
                        handleMarkAsRead(notification._id);
                      }}
                      disabled={isPendingMarkAsRead}
                      className="mt-2 text-blue-500 hover:underline"
                    >
                      Mark as Read
                    </button>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem key="none">
                No notifications found
              </DropdownMenuItem>
            ),
          ]}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotificationIcon;
