// useUpdateGroupReservationStatus.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { updateGroupReservationStatus } from "../api/group";
import { useSendNotificationToUser } from "@/features/Notifications/hooks/useSendNotificationToUser";
import { useSendPushNotificationToUser } from "@/features/Notifications/hooks/useSendPushNotificationToUser";

// Update the input type to include userId.
interface UpdateGroupReservationStatusArgs {
  reservationId: string;
  eventStatus: string;
  userId: string;
}

export const useUpdateGroupReservationStatus = () => {
  const queryClient = useQueryClient();
  // Retrieve realtime notification function.
  const { mutate: sendRealtimeNotification } = useSendNotificationToUser();
  // Retrieve push notification function.
  const { mutate: sendPushNotification } = useSendPushNotificationToUser();

  const { mutate, isPending, isError, error } = useMutation<
    string, // API returns a success message
    Error,
    UpdateGroupReservationStatusArgs
  >({
    mutationFn: ({
      reservationId,
      eventStatus,
    }: UpdateGroupReservationStatusArgs) =>
      updateGroupReservationStatus(eventStatus, reservationId),
    onError: (err) => {
      console.error("Error updating group reservation status:", err);
      toast({
        title: "Error updating reservation",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: (data, variables) => {
      console.log("Group reservation updated successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["groupReservations"] });
      toast({
        title: "Reservation updated",
        description: "The group reservation status was updated successfully.",
        variant: "default",
      });

      // Send notifications if userId is provided.
      if (variables.userId) {
        // Send realtime notification.
        sendRealtimeNotification({
          title: "Reservation Status Updated",
          description: `Your reservation status has been updated to ${variables.eventStatus}.`,
          redirectUrl: "/profile", // Adjust as needed.
          userId: variables.userId,
        });
        // Send push notification.
        sendPushNotification({
          userId: variables.userId,
          title: "Reservation Status Updated",
          body: `Your reservation status has been updated to ${variables.eventStatus}.`,
        });
      }
    },
  });

  return { mutate, isPending, isError, error };
};
