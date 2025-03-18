// src/notifications/hooks/useMarkNotificationAsRead.tsx
import { useMutation } from "@tanstack/react-query";
import { markNotificationAsRead } from "../api/notification";

export const useMarkNotificationAsRead = () => {
  return useMutation({
    mutationFn: (notificationId: string): Promise<void> => {
      if (!notificationId) {
        throw new Error("notificationId is undefined");
      }
      return markNotificationAsRead(notificationId);
    },
    // Removed query invalidation so local state isn’t overwritten.
    onError: (error: Error) => {
      console.error("Mutation error:", error);
    },
  });
};
