// hooks/useSendNotificationToAdmin.ts
import { toast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  NotificationResponse,
  sendNotificationToAdmin,
} from "../api/notification";

// Define a payload type for admin notifications.
// Since the backend will find all admin users, only title and description are needed.
export type AdminNotificationPayload = {
  title: string;
  description: string;
};

export const useSendNotificationToAdmin = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    NotificationResponse, // Success type
    Error, // Error type
    AdminNotificationPayload // Payload type
  >({
    mutationFn: async (payload: AdminNotificationPayload) => {
      // Validate payload fields
      if (!payload.title || !payload.description) {
        throw new Error(
          "Title and description are required for admin notifications.",
        );
      }
      // Call the API function to send notification to all admin users
      return await sendNotificationToAdmin(payload.title, payload.description);
    },
    onError: (err: Error) => {
      console.error("Error sending admin notification:", err);
      toast({
        title: "Error sending notification",
        description:
          err.message || "An error occurred while sending the notification.",
        variant: "destructive",
      });
    },
    onSuccess: async (data) => {
      try {
        console.log("Admin notification sent and saved successfully:", data);
        // Invalidate admin notifications query to re-fetch updated data.
        queryClient.invalidateQueries({ queryKey: ["adminNotifications"] });
        toast({
          title: "Notification sent",
          description: "The notification was sent successfully.",
          variant: "default",
        });
      } catch (error) {
        console.error("Error saving admin notification:", error);
      }
    },
  });

  return { mutate, isPending, isError, error };
};
