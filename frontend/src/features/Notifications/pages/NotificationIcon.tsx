// src/components/NotificationIcon.tsx
import React, { useEffect } from "react";
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
import { useMarkNotificationAsRead } from "@/features/Notifications/hooks/useMarkNotificationasRead";
import { useNotifications } from "../hooks/useNotification";

const NotificationIcon: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleRedirect = (redirectUrl: string) => {
    if (redirectUrl) {
      navigate(redirectUrl);
    }
  };

  // Fetch initial notifications via REST (ensure this endpoint returns only unread notifications).
  const {
    data: initialNotifications,
    isPending,
    error,
  } = useNotifications(user?._id || "");

  // Setup realtime notifications using the DB-saved notifications.
  const { notifications, unreadCount, setNotifications } =
    useNotificationReceiver(
      user?._id || "",
      (initialNotifications as MyNotification[]) || [],
    );

  useEffect(() => {
    console.log("Current notifications state:", notifications);
  }, [notifications]);

  const { mutate: markAsRead, isPending: isPendingMarkAsRead } =
    useMarkNotificationAsRead();

  // When marking a notification as read, update the DB and remove it from local state.
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
          <DropdownMenuLabel className="font-bold">
            NOTIFICATIONS
          </DropdownMenuLabel>
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
