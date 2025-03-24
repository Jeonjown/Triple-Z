import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  createNotification,
  NotificationData,
  NotificationResponse,
} from "../api/notification";

export type NotificationPayload = NotificationData;

export const useSendNotificationToUser = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    NotificationResponse, // Success type
    Error, // Error type
    NotificationPayload // Payload type
  >({
    mutationFn: async (payload: NotificationPayload) => {
      if (!payload.userId) {
        throw new Error("userId is required for user-specific notifications.");
      }
      // Directly call the API helper to create the notification.
      return await createNotification(payload);
    },
    onError: (err: Error) => {
      console.error("Error sending notification:", err);
      // Removed toast call.
    },
    onSuccess: (data) => {
      console.log("Notification sent and saved successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      // Removed toast call.
    },
  });

  return { mutate, isPending, isError, error };
};
