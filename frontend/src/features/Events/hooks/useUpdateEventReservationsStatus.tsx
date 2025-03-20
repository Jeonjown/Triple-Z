import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEventReservationStatus } from "../api/event";
import { toast } from "@/hooks/use-toast";
import { useSendNotificationToUser } from "@/features/Notifications/hooks/useSendNotificationToUser";
import { useSendPushNotificationToUser } from "@/features/Notifications/hooks/useSendPushNotificationToUser";

// Extend the update status arguments to include the userId needed for notifications.
interface UpdateReservationStatusArgs {
  reservationId: string;
  eventStatus: string;
  userId: string;
}

export const useUpdateEventReservationStatus = () => {
  const queryClient = useQueryClient();
  // Get the push notification mutation from our dedicated hook.
  const { mutate: pushNotificationMutate } = useSendPushNotificationToUser();
  // Get the realtime notification mutation from our dedicated hook.
  const { mutate: realtimeNotificationMutate } = useSendNotificationToUser();

  const { mutate, isPending, isError, error } = useMutation<
    string, // Success type returned by updateEventReservationStatus.
    Error, // Error type.
    UpdateReservationStatusArgs // Input type for the mutation function.
  >({
    // Mutation function updates the event reservation status.
    mutationFn: ({
      reservationId,
      eventStatus,
    }: UpdateReservationStatusArgs) => {
      return updateEventReservationStatus(eventStatus, reservationId);
    },
    onError: (err) => {
      console.error("Error updating reservation:", err);
      toast({
        title: "Error updating reservation",
        description: `${err}`,
        variant: "destructive",
      });
    },
    onSuccess: (data, variables) => {
      console.log("Reservation updated successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["eventReservations"] });
      toast({
        title: "Reservation updated",
        description: "The reservation status was updated successfully.",
        variant: "default",
      });

      // Build the realtime notification payload.
      const realtimePayload = {
        title: "Reservation Status Updated",
        description: `Your reservation status has been updated to ${variables.eventStatus}.`,
        redirectUrl: "/profile", // Adjust the redirect URL as needed.
        userId: variables.userId,
      };

      // Send realtime notification.
      realtimeNotificationMutate(realtimePayload);

      // Build the push notification payload.
      const pushPayload = {
        title: "Reservation Status Updated",
        body: `Your reservation status has been updated to ${variables.eventStatus}.`,
        userId: variables.userId,
      };

      // Send push notification.
      pushNotificationMutate(pushPayload);
    },
  });

  return { mutate, isPending, isError, error };
};
