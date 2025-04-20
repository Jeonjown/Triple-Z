import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEventReservation, Reservation } from "../api/event"; // Make sure Reservation type is correct
import { toast } from "@/hooks/use-toast";
import { EventFormValues } from "../pages/EventForm";
import { useParams } from "react-router-dom";
import { useSendPushNotificationToAdmins } from "@/features/Notifications/hooks/useSendPushNotificationToAdmins";
import { socket } from "@/socket";

export const useCreateEventReservations = () => {
  const queryClient = useQueryClient();
  const { userId } = useParams();
  const { mutate: sendPushNotification } = useSendPushNotificationToAdmins();

  // Destructure `data`, `isPending`, `error`, `mutate` directly from useMutation
  const {
    mutate,
    isPending,
    isError,
    error,
    data, // <-- The result is available here after success
    isSuccess, // <-- Use this state to know when data is ready
  } = useMutation<
    Reservation, // Success type
    Error, // Error type
    EventFormValues // Input type
  >({
    mutationFn: (values: EventFormValues) => {
      if (!userId) {
        // Consider handling this earlier in the component if userId might be missing before mutation
        throw new Error("User ID is required");
      }
      return createEventReservation(values, userId);
    },
    onError: (err: Error) => {
      console.error("Error creating reservation:", err);
      toast({
        title: "Reservation Creation Unsuccesssful",
        description: err.message,
        variant: "destructive",
      });
      // If you had component-level state depending on success/error, you'd update it here
    },
    onSuccess: (data) => {
      console.log("Mutation onSuccess in hook:", data.reservation.paymentLink);

      // Side effects that the hook is responsible for:
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
          click_action: "/admin/manage-events",
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
        redirectUrl: "/admin/manage-events",
      });
    },
  });

  // Return the mutation controls and status, including `data` and `isSuccess`
  return { mutate, isPending, isError, error, data, isSuccess };
};
