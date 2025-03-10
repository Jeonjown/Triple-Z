// src/notifications/hooks/useMarkNotificationAsRead.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "../api/notification";

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string): Promise<void> => {
      if (!notificationId) {
        throw new Error("notificationId is undefined");
      }
      return markNotificationAsRead(notificationId);
    },
    onSuccess: () => {
      // Invalidate the notifications query to refetch notifications.
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
    },
  });
};
