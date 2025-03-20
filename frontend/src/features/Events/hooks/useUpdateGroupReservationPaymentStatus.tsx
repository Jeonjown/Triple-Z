// useUpdateGroupReservationPaymentStatus.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { updateGroupReservationPaymentStatus } from "../api/group";
import { useSendNotificationToUser } from "@/features/Notifications/hooks/useSendNotificationToUser";
import { useSendPushNotificationToUser } from "@/features/Notifications/hooks/useSendPushNotificationToUser";

// Update the input type to include userId.
interface UpdateGroupReservationPaymentStatusArgs {
  reservationId: string;
  paymentStatus: string;
  userId: string;
}

export const useUpdateGroupReservationPaymentStatus = () => {
  const queryClient = useQueryClient();
  // Get the realtime notification mutation.
  const { mutate: sendRealtimeNotification } = useSendNotificationToUser();
  // Get the push notification mutation.
  const { mutate: sendPushNotification } = useSendPushNotificationToUser();

  const { mutate, isPending, isError, error } = useMutation<
    string, // Success type
    Error, // Error type
    UpdateGroupReservationPaymentStatusArgs // Input type
  >({
    mutationFn: ({
      reservationId,
      paymentStatus,
    }: UpdateGroupReservationPaymentStatusArgs) =>
      updateGroupReservationPaymentStatus(paymentStatus, reservationId),
    onError: (err: Error) => {
      console.error("Error updating group reservation payment status:", err);
      toast({
        title: "Error updating payment status",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: (data: string, variables) => {
      console.log("Group payment status updated successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["groupReservations"] });
      toast({
        title: "Payment status updated",
        description: "The payment status was updated successfully.",
        variant: "default",
      });

      // If a valid userId exists, send notifications.
      if (variables.userId) {
        // Send realtime notification.
        sendRealtimeNotification({
          title: "Reservation Status Updated",
          description: `Your reservation payment status has been updated to ${variables.paymentStatus}.`,
          redirectUrl: "/profile", // Adjust as needed.
          userId: variables.userId,
        });
        // Send push notification.
        sendPushNotification({
          userId: variables.userId,
          title: "Reservation Status Updated",
          body: `Your reservation payment status has been updated to ${variables.paymentStatus}.`,
        });
      }
    },
  });

  return { mutate, isPending, isError, error };
};
