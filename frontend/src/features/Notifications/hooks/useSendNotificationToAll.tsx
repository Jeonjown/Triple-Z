import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
  sendNotificationToAll,
  NotificationPayload,
  NotificationResponse,
} from "../api/notification";

/**
 * Custom hook to send a notification to all users.
 */
export const useSendNotificationToAll = () => {
  const queryClient = useQueryClient();

  // Use the full NotificationPayload which includes userId
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
      toast({
        title: "Error sending notification",
        description:
          err.message || "An error occurred while sending the notification.",
        variant: "destructive",
      });
    },
    onSuccess: (data: NotificationResponse) => {
      console.log("Notification sent successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast({
        title: "Notification sent",
        description: "The notification was sent successfully.",
        variant: "default",
      });
    },
  });

  return { mutate, isPending, isError, error };
};
