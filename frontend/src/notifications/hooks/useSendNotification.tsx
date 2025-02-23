import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { sendNotification } from "../api/notification";

// Define the shape of the payload you send.
interface NotificationPayload {
  title: string;
  description: string;
}

// Define the expected response type.
interface NotificationResponse {
  message: string;
}

export const useSendNotification = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    NotificationResponse, // Success type
    Error, // Error type
    NotificationPayload // Payload shape
  >({
    // Wrap the sendNotification function so that it accepts a payload.
    mutationFn: async (payload: NotificationPayload) => {
      return await sendNotification(payload.title, payload.description);
    },
    // Called when the mutation fails.
    onError: (err: Error) => {
      console.error("Error sending notification:", err);
      toast({
        title: "Error sending notification",
        description:
          err.message || "An error occurred while sending the notification.",
        variant: "destructive",
      });
    },
    // Called when the mutation is successful.
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
