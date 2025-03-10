// hooks/useSendNotificationToUser.ts
import { toast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  createNotification,
  NotificationData,
  NotificationResponse,
  sendNotificationToUser,
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
    onSuccess: async (data, variables) => {
      try {
        // Use the original payload (variables) to save the notification
        await createNotification(variables);
        console.log("Notification sent and saved successfully:", data);
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        toast({
          title: "Notification sent",
          description: "The notification was sent successfully.",
          variant: "default",
        });
      } catch (error) {
        console.error("Error saving notification:", error);
      }
    },
  });

  return { mutate, isPending, isError, error };
};
