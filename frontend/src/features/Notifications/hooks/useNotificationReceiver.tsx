// src/notifications/hooks/useNotificationReceiver.ts
import { useState, useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import { playPingSound } from "@/utils/playPingSound";

// Rename the type to avoid conflict with the built-in Notification type.
export interface MyNotification {
  _id: string;
  userId: string;
  title: string;
  description: string;
  redirectUrl: string;
  read: boolean;
}

export const useNotificationReceiver = (
  roomId: string,
  initialNotifications: MyNotification[] = [],
) => {
  const [notifications, setNotifications] =
    useState<MyNotification[]>(initialNotifications);
  const socket = useSocket(roomId);

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification: MyNotification) => {
      console.log("Received realtime notification:", notification);
      playPingSound();
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, setNotifications };
};
