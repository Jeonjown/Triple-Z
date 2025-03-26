// src/hooks/useRescheduleReservationWithNotification.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { CustomError } from "types";
import { useSendNotificationToUser } from "@/features/Notifications/hooks/useSendNotificationToUser";
import { useSendPushNotificationToUser } from "@/features/Notifications/hooks/useSendPushNotificationToUser";
import { adminRescheduleEventReservation, Reservation } from "../api/event"; // Your reschedule endpoint

// Define the shape of the data for rescheduling a reservation.
export interface RescheduleReservationData {
  reservationId: string;
  date: string;
  startTime: string;
  endTime: string;
}

// Define the arguments expected by the mutation function.
interface RescheduleReservationArgs {
  userId: string;
  updateData: RescheduleReservationData;
}

export const useRescheduleEventReservation = () => {
  const queryClient = useQueryClient();
  // Get the notification functions.
  const { mutate: sendRealtimeNotification } = useSendNotificationToUser();
  const { mutate: sendPushNotification } = useSendPushNotificationToUser();

  const { mutate, isPending, isError, error } = useMutation<
    Reservation, // TData: the result type
    CustomError, // TError: error type
    RescheduleReservationArgs, // TVariables: the input type
    unknown // TContext: (optional) context type
  >({
    mutationFn: ({ updateData }) => adminRescheduleEventReservation(updateData),
    onSuccess: (payload) => {
      console.log(payload);
      // Invalidate queries to refresh reservation data.
      queryClient.invalidateQueries({ queryKey: ["eventReservations"] });

      // Show a success toast.
      toast({
        title: "Reservation Rescheduled",
        description: "The reservation has been rescheduled successfully.",
      });
      // Send notifications if a valid userId exists.
      if (payload.reservation.userId._id) {
        sendRealtimeNotification({
          title: "Reservation Rescheduled",
          description:
            "Your reservation has been rescheduled by an admin. Please check your profile for the updated details.",
          redirectUrl: "/profile",
          userId: payload.reservation.userId._id,
        });
        sendPushNotification({
          userId: payload.reservation.userId._id,
          title: "Reservation Rescheduled",
          body: "Your reservation has been rescheduled by an admin. Please check your profile for the updated details.",
          click_action: "/profile",
        });
      }
    },
    onError: (error: CustomError) => {
      toast({
        title: "Error Rescheduling Reservation",
        description:
          error.message ||
          "An error occurred while rescheduling the reservation.",
        variant: "destructive",
      });
    },
  });

  return { mutate, isPending, isError, error };
};
