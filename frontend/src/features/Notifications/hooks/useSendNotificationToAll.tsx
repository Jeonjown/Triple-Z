import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationPayload, NotificationResponse } from "../api/notification";

/**
 * Custom hook to send a notification to all users.
 */
export const useSendNotificationToAll = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    NotificationResponse, // Success type
    Error, // Error type
    NotificationPayload // Payload type
  >({
    mutationFn: async (payload: NotificationPayload) => {
      return await sendNotificationToAll(
        payload.title,
        payload.description,
        payload.userId,
      );
    },
    onError: (err: Error) => {
      console.error("Error sending notification to all:", err);
      // Removed toast call.
    },
    onSuccess: (data: NotificationResponse) => {
      console.log("Notification sent successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      // Removed toast call.
    },
  });

  return { mutate, isPending, isError, error };
};
