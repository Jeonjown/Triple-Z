import { useState, useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
// import { playPingSound } from "@/utils/playPingSound";

export interface MyNotification {
  _id: string;
  userId: string;
  title: string;
  description: string;
  redirectUrl: string;
  read: boolean;
  createdAt: string;
}

export const useNotificationReceiver = (
  userId: string,
  initialNotifications: MyNotification[] = [],
) => {
  // Initialize the notifications state.
  const [notifications, setNotifications] =
    useState<MyNotification[]>(initialNotifications);

  // Get the socket connection.
  const socket = useSocket(userId);

  // Update notifications state when the initial notifications prop changes.
  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  // Setup socket listeners for notifications.
  useEffect(() => {
    if (!socket || !userId) {
      return;
    }

    // Request the full notifications list from the server.
    socket.emit("get-notifications", userId);

    // Listener for receiving the full list of notifications.
    const handleNotifications = (notifs: MyNotification[]) => {
      setNotifications(notifs);
    };

    // Listener for receiving a new realtime notification.
    const handleRealtimeNotification = (notification: MyNotification) => {
      // playPingSound();
      setNotifications((prev) => [notification, ...prev]);
    };

    // Register the event listeners.
    socket.on("notifications", handleNotifications);
    socket.on("notification", handleRealtimeNotification);

    // Cleanup listeners on unmount or dependency change.
    return () => {
      console.log("Cleaning up socket listeners for realtime updates");
      socket.off("notifications", handleNotifications);
      socket.off("notification", handleRealtimeNotification);
    };
  }, [socket, userId]);

  // Calculate the number of unread notifications.
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return { notifications, unreadCount, setNotifications };
};
