import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useSendPushNotificationToAdmins } from "@/features/Notifications/hooks/useSendPushNotificationToAdmins";
import { socket } from "@/socket";
import { cancelReservation, Reservation } from "../api/event";

interface CancelReservationResponse {
  message: string;
  reservation: Reservation;
}

export const useCancelReservation = () => {
  const queryClient = useQueryClient();
  const { mutate: sendPushNotification } = useSendPushNotificationToAdmins();

  const { mutate, isPending, isError, error } = useMutation<
    CancelReservationResponse, // success response type
    Error, // error type
    string // input type: reservationId
  >({
    mutationFn: (reservationId: string) => cancelReservation(reservationId),
    onError: (err: Error) => {
      console.error("Error canceling reservation:", err);
      toast({
        title: "Cancel Reservation Unsuccesssful:",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: (data: CancelReservationResponse) => {
      console.log("Reservation canceled successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast({
        title: "Reservation canceled",
        description: "The reservation was canceled successfully.",
        variant: "default",
      });

      // Determine the redirect URL based on reservation type.
      const redirectUrl =
        data.reservation.reservationType === "Groups"
          ? "/admin/manage-groups"
          : "/admin/manage-events";

      // Send push notification to admins.
      sendPushNotification(
        {
          title: "Reservation Cancelled",
          body: `Reservation for ${data.reservation.fullName} on ${new Date(
            data.reservation.date,
          ).toLocaleDateString()} has been cancelled by the user.`,
          click_action: redirectUrl,
        },
        {
          onSuccess: () => {
            console.log("Admin push notification sent successfully.");
          },
          onError: (notificationError: Error) => {
            console.error(
              "Error sending admin push notification:",
              notificationError,
            );
          },
        },
      );

      // Emit realtime notification to admins via socket.
      socket.emit("send-admins-notification", {
        title: "Reservation Cancelled",
        body: `Reservation for ${data.reservation.fullName} on ${new Date(
          data.reservation.date,
        ).toLocaleDateString()} has been cancelled by the user.`,
        redirectUrl,
      });
    },
  });

  return { mutate, isPending, isError, error };
};
