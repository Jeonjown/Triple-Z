import { toast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  NotificationResponse,
  NotificationPayload,
  sendNotificationToUser,
} from "../api/notification";

export const useSendNotificationToUser = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    NotificationResponse, // Success type
    Error, // Error type
    NotificationPayload // Payload type; userId is required here.
  >({
    mutationFn: async (payload: NotificationPayload) => {
      if (!payload.userId) {
        throw new Error("userId is required for user-specific notifications.");
      }
      return await sendNotificationToUser(
        payload.title,
        payload.description,
        payload.userId,
      );
    },
    onError: (err: Error) => {
      console.error("Error sending notification:", err);
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
