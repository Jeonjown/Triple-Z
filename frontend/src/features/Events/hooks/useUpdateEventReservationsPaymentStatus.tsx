// hooks/useUpdateEventReservationPaymentStatusWithNotification.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEventReservationPaymentStatus } from "../api/event";
import { toast } from "@/hooks/use-toast";
import { useSendNotificationToUser } from "@/features/Notifications/hooks/useSendNotificationToUser";
import { useSendPushNotificationToUser } from "@/features/Notifications/hooks/useSendPushNotificationToUser";

// Extend the input type to include userId.
interface UpdateReservationStatusArgs {
  reservationId: string;
  paymentStatus: string;
  userId: string;
}

export const useUpdateEventReservationPaymentStatusWithNotification = () => {
  const queryClient = useQueryClient();
  // Get the realtime notification mutation.
  const { mutate: sendRealtimeNotification } = useSendNotificationToUser();
  // Get the push notification mutation.
  const { mutate: sendPushNotification } = useSendPushNotificationToUser();

  const { mutate, isPending, isError, error } = useMutation<
    string, // success type from updateEventReservationPaymentStatus
    Error, // error type
    UpdateReservationStatusArgs // input type for mutation function
  >({
    mutationFn: ({
      reservationId,
      paymentStatus,
    }: UpdateReservationStatusArgs) => {
      // Update the payment status.
      return updateEventReservationPaymentStatus(paymentStatus, reservationId);
    },
    onError: (err) => {
      console.error("Error updating payment status:", err);
      toast({
        title: "Error updating payment status",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: (data, variables) => {
      console.log("Payment status updated successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["eventReservations"] });
      toast({
        title: "Payment status updated",
        description: "The payment status was updated successfully.",
        variant: "default",
      });

      // If a valid userId exists, send notifications.
      if (variables.userId) {
        // Build and send realtime notification.
        sendRealtimeNotification({
          title: "Reservation Status Updated",
          description: `Your reservation payment status has been updated to ${variables.paymentStatus}.`,
          redirectUrl: "/profile",
          userId: variables.userId,
        });
        // Build and send push notification.
        sendPushNotification({
          userId: variables.userId,
          title: "Reservation Status Updated",
          body: `Your reservation payment status has been updated to ${variables.paymentStatus}.`,
          click_action: "/profile",
        });
      }
    },
  });

  return { mutate, isPending, isError, error };
};
