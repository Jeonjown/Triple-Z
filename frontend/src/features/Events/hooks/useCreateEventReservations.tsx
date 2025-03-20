import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEventReservation, Reservation } from "../api/event";
import { toast } from "@/hooks/use-toast";
import { EventFormValues } from "../pages/EventForm";
import { useParams } from "react-router-dom";
import { useSendPushNotificationToAdmins } from "@/features/Notifications/hooks/useSendPushNotificationToAdmins";
import { socket } from "@/socket";

export const useCreateEventReservations = () => {
  const queryClient = useQueryClient();
  const { userId } = useParams();
  const { mutate: sendPushNotification } = useSendPushNotificationToAdmins();

  const { mutate, isPending, isError, error } = useMutation<
    Reservation, // Success type
    Error, // Error type
    EventFormValues // Input type
  >({
    mutationFn: (values: EventFormValues) => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      return createEventReservation(values, userId);
    },
    onError: (err: Error) => {
      console.error("Error creating reservation:", err);
      toast({
        title: "Error creating reservation",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      console.log("Reservation created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["eventReservations"] });
      toast({
        title: "Reservation created",
        description: "The reservation was created successfully.",
        variant: "default",
      });

      // Send push notification to admins.
      sendPushNotification(
        {
          title: "New Event Reservation Received",
          body: `Reservation for ${data.reservation.fullName} on ${new Date(
            data.reservation.date,
          ).toLocaleDateString()} has been received.`,
        },
        {
          onSuccess: () => {
            console.log("Admin notification sent successfully.");
          },
          onError: (notificationError: Error) => {
            console.error(
              "Error sending admin notification:",
              notificationError,
            );
          },
        },
      );
      // Emit a realtime notification to admins via the socket instance.
      socket.emit("send-admins-notification", {
        title: "New Event Reservation Received",
        body: `Reservation for ${data.reservation.fullName} on ${new Date(
          data.reservation.date,
        ).toLocaleDateString()} has been received.`,
        redirectUrl: "/manage-events",
      });
    },
  });

  return { mutate, isPending, isError, error };
};
