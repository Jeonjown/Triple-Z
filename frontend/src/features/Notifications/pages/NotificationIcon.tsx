import React, { useEffect, useState } from "react";
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

const NotificationIcon: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  const handleRedirect = (redirectUrl: string) => {
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

  // Setup realtime notifications.
  const { notifications, unreadCount, setNotifications } =
    useNotificationReceiver(
      user?._id || "",
      (initialNotifications as MyNotification[]) || [],
    );

  useEffect(() => {
    console.log("Current notifications state:", notifications);
  }, [notifications]);

  // Single notification mutation hook.
  const { mutate: markAsRead, isPending: isPendingMarkAsRead } =
    useMarkNotificationAsRead();

  // Mark all notifications mutation hook.
  const { mutate: markAllAsRead, isPending: isMarkingAll } =
    useMarkAllNotificationsAsRead();

  // When marking a single notification as read.
  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId, {
      onSuccess: () => {
        console.log(`Notification ${notificationId} marked as read`);
        setNotifications((prev) =>
          prev.filter((notification) => notification._id !== notificationId),
        );
      },
    });
  };

  // When marking all notifications as read.
  const handleMarkAllAsRead = () => {
    markAllAsRead(user?._id || "", {
      onSuccess: () => {
        // Clear local notifications.
        setNotifications([]);
        // Hide the "more options" section.
        setShowMore(false);
      },
    });
  };

  // Filter notifications to show only unread ones.
  const unreadNotifications = notifications.filter((notif) => !notif.read);

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
        <DropdownMenuContent className="mr-2 px-5">
          {/* Header: Notification label and ellipsis icon */}
          <DropdownMenuLabel className="flex items-center justify-between font-bold">
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
          {/* Conditionally render the "Mark All As Read" option */}
          {showMore && (
            <DropdownMenuItem
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll}
              className="cursor-pointer text-blue-500"
            >
              Mark All As Read
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {isPending ? (
            <DropdownMenuItem>Loading notifications...</DropdownMenuItem>
          ) : error ? (
            <DropdownMenuItem>Error loading notifications</DropdownMenuItem>
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
            <DropdownMenuItem>No unread notifications</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotificationIcon;
