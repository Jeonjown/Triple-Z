import { useMutation } from "@tanstack/react-query";
import {
  notifyAdmins as notifyAdminFunc,
  AdminPushNotificationPayload,
  PushNotificationResponse,
} from "../api/pushNotification";

export const useSendPushNotificationToAdmins = () => {
  const { mutate, isPending, isError, error } = useMutation<
    PushNotificationResponse,
    Error,
    AdminPushNotificationPayload
  >({
    mutationFn: notifyAdminFunc,
    onError: (err: Error) => {
      console.error("Error sending admin push notification:", err);
    },
    onSuccess: (data: PushNotificationResponse) => {
      console.log("Admin push notification sent successfully:", data);
    },
  });

  return { mutate, isPending, isError, error };
};
