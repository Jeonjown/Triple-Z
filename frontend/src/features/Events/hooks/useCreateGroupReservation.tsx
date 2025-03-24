import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import {
  GroupReservation,
  GroupReservationFormValues,
  createGroupReservation,
} from "../api/group";
import { useSendPushNotificationToAdmins } from "@/features/Notifications/hooks/useSendPushNotificationToAdmins";
import { socket } from "@/socket";

export const useCreateGroupReservation = () => {
  const queryClient = useQueryClient();
  const { userId } = useParams<{ userId: string }>();
  const { mutate: sendPushNotification } = useSendPushNotificationToAdmins();

  const { mutate, isPending, isError, error } = useMutation<
    GroupReservation,
    Error,
    GroupReservationFormValues
  >({
    mutationFn: (values: GroupReservationFormValues) => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      return createGroupReservation(values, userId);
    },
    onError: (err: Error) => {
      console.error("Error creating group reservation:", err);
      toast({
        title: "Error creating reservation",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: (data: GroupReservation) => {
      queryClient.invalidateQueries({ queryKey: ["groupReservations"] });
      toast({
        title: "Reservation created",
        description: "The group reservation was created successfully.",
        variant: "default",
      });
      console.log(data);

      // Send push notification to admins.
      sendPushNotification(
        {
          title: "New Group Reservation Received",
          body: `Reservation for ${data.fullName} on ${new Date(
            data.date,
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

      // Emit a realtime notification via the socket instance.
      socket.emit("send-admins-notification", {
        title: "New Group Reservation Received",
        body: `Reservation for ${data.fullName} on ${new Date(
          data.date,
        ).toLocaleDateString()} has been received.`,
        redirectUrl: "admin/manage-groups",
      });
    },
  });

  return { mutate, isPending, isError, error };
};
