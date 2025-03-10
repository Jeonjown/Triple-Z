// hooks/useNotifications.ts
import { useQuery } from "@tanstack/react-query";
import { getNotificationsForUser, NotificationData } from "../api/notification";

export const useNotifications = (userId: string) => {
  return useQuery<NotificationData[]>({
    queryKey: ["notifications", userId],
    queryFn: () => getNotificationsForUser(userId),
    staleTime: 60000,
  });
};
