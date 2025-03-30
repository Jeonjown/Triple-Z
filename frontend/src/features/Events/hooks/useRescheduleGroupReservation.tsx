// src/hooks/useRescheduleGroupReservation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { CustomError } from "types";
import { useSendNotificationToUser } from "@/features/Notifications/hooks/useSendNotificationToUser";
import { useSendPushNotificationToUser } from "@/features/Notifications/hooks/useSendPushNotificationToUser";
import {
  adminRescheduleGroupReservation,
  GroupReservation,
} from "../api/group";

// Define the data shape for rescheduling a group reservation.
export interface RescheduleGroupReservationData {
  reservationId: string;
  date: string;
  startTime: string;
  endTime: string;
}

// Define the mutation argument shape.
interface RescheduleGroupReservationArgs {
  userId: string;
  updateData: RescheduleGroupReservationData;
}

export const useRescheduleGroupReservation = () => {
  const queryClient = useQueryClient();
  // Get notification functions.
  const { mutate: sendRealtimeNotification } = useSendNotificationToUser();
  const { mutate: sendPushNotification } = useSendPushNotificationToUser();

  const { mutate, isPending, isError, error } = useMutation<
    GroupReservation, // Result type
    CustomError, // Error type
    RescheduleGroupReservationArgs // Input type
  >({
    mutationFn: ({ updateData }) => adminRescheduleGroupReservation(updateData),
    onSuccess: (payload) => {
      // Invalidate group reservations query to refresh data.
      queryClient.invalidateQueries({ queryKey: ["groupReservations"] });
      toast({
        title: "Reservation Rescheduled",
        description: "The group reservation has been rescheduled successfully.",
      });
      // Safely check if payload.userId exists and has _id
      if (payload.userId?.["_id"]) {
        sendRealtimeNotification({
          title: "Group Reservation Rescheduled",
          description:
            "Your group reservation has been rescheduled by an admin. Please check your profile for details.",
          redirectUrl: "/profile",
          userId: payload.userId._id,
        });
        sendPushNotification({
          userId: payload.userId._id,
          title: "Group Reservation Rescheduled",
          body: "Your group reservation has been rescheduled by an admin. Please check your profile for details.",
          click_action: "/profile",
        });
      }
    },
  });

  return { mutate, isPending, isError, error };
};
