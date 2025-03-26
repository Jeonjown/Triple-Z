import React, { useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { FaBell } from "react-icons/fa";
import { EllipsisVertical } from "lucide-react";
import useAuthStore from "@/features/Auth/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import {
  useNotificationReceiver,
  MyNotification,
} from "@/features/Notifications/hooks/useNotificationReceiver";
import { useMarkNotificationAsRead } from "@/features/Notifications/hooks/useMarkNotificationasRead";
import { useNotifications } from "../hooks/useNotification";
import { useMarkAllNotificationsAsRead } from "../hooks/useMarkAllNotificationAsRead";
import { format } from "date-fns";

const NotificationIcon: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState<boolean>(false);

  const handleRedirect = (redirectUrl: string): void => {
    if (redirectUrl) {
      navigate(redirectUrl);
    }
  };

  // Fetch initial notifications via REST.
  const {
    data: initialNotifications,
    isPending,
    error,
  } = useNotifications(user?._id || "");

  // Memoize initial notifications for a stable reference.
  const memoizedInitialNotifications = useMemo<MyNotification[]>(() => {
    return (initialNotifications as MyNotification[]) || [];
  }, [initialNotifications]);

  // Setup realtime notifications with memoized notifications.
  const { notifications, unreadCount, setNotifications } =
    useNotificationReceiver(user?._id || "", memoizedInitialNotifications);

  // Mutation hook for marking a single notification as read.
  const { mutate: markAsRead, isPending: isPendingMarkAsRead } =
    useMarkNotificationAsRead();

  // Mutation hook for marking all notifications as read.
  const { mutate: markAllAsRead, isPending: isMarkingAll } =
    useMarkAllNotificationsAsRead();

  // Handle marking a single notification as read.
  const handleMarkAsRead = (notificationId: string): void => {
    markAsRead(notificationId, {
      onSuccess: () => {
        console.log(`Notification ${notificationId} marked as read`);
        setNotifications((prev: MyNotification[]) =>
          prev.filter((notification) => notification._id !== notificationId),
        );
      },
    });
  };

  // Handle marking all notifications as read.
  const handleMarkAllAsRead = (): void => {
    markAllAsRead(user?._id || "", {
      onSuccess: () => {
        setNotifications([]); // Clear local notifications.
        setShowMore(false); // Hide the "more options" section.
      },
    });
  };

  // Filter notifications to show only unread ones.
  const unreadNotifications: MyNotification[] = notifications.filter(
    (notif) => !notif.read,
  );

  return (
    <div className="relative ml-auto items-center gap-2 md:flex">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="relative">
          <FaBell size={28} className="text-icon hover:scale-105" />
          {unreadCount > 0 && (
            <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white sm:text-xs">
              {unreadCount}
            </span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-2 max-h-[80vh] w-[250px] overflow-y-auto px-2 sm:w-auto sm:px-5">
          {/* Header: Notification label and ellipsis icon */}
          <DropdownMenuLabel className="flex items-center justify-between text-xs font-bold sm:text-sm">
            <span>NOTIFICATIONS</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMore((prev) => !prev);
              }}
              className="hover:scale-110"
            >
              <EllipsisVertical size={16} />
            </button>
          </DropdownMenuLabel>
          {/* "Mark All As Read" option */}
          {showMore && (
            <DropdownMenuItem
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll}
              className="cursor-pointer text-xs text-blue-500 sm:text-sm"
            >
              Mark All As Read
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {isPending ? (
            <DropdownMenuItem className="text-xs sm:text-sm">
              Loading notifications...
            </DropdownMenuItem>
          ) : error ? (
            <DropdownMenuItem className="text-xs sm:text-sm">
              Error loading notifications
            </DropdownMenuItem>
          ) : unreadNotifications.length > 0 ? (
            unreadNotifications.map((notification: MyNotification) => (
              <DropdownMenuItem
                key={notification._id}
                className="text-xs hover:cursor-pointer sm:text-sm"
                onClick={() => handleRedirect(notification.redirectUrl)}
              >
                <div>
                  <strong>{notification.title}</strong>
                  <p className="mt-1">{notification.description}</p>
                  {/* Display date and time based on createdAt */}
                  <p className="mt-1 text-xs text-gray-500">
                    {format(
                      new Date(notification.createdAt),
                      "MMM dd, yyyy, h:mm a",
                    )}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notification._id);
                    }}
                    disabled={isPendingMarkAsRead}
                    className="mt-2 text-xs text-blue-500 hover:underline sm:text-sm"
                  >
                    Mark as Read
                  </button>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem className="text-xs sm:text-sm">
              No unread notifications
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotificationIcon;
