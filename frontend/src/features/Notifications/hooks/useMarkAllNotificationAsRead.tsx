import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  markAllNotificationsAsRead,
  NotificationResponse,
} from "../api/notification";

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string): Promise<NotificationResponse> => {
      if (!userId) {
        throw new Error("userId is undefined");
      }
      return markAllNotificationsAsRead(userId);
    },
    onSuccess: () => {
      // Invalidate the "notifications" query so data is refetched.
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
    },
  });
};
