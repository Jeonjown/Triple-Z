import { useMutation } from "@tanstack/react-query";
import {
  sendPushNotificationToUser as sendNotification,
  UserPushNotificationPayload,
  PushNotificationResponse,
} from "../api/pushNotification";

export const useSendPushNotificationToUser = () => {
  const { mutate, isPending, isError, error } = useMutation<
    PushNotificationResponse,
    Error,
    UserPushNotificationPayload
  >({
    mutationFn: sendNotification,
    onError: (err: Error) => {
      console.error("Error sending push notification:", err);
    },
    onSuccess: (data: PushNotificationResponse) => {
      console.log("Push notification sent successfully:", data);
    },
  });

  return { mutate, isPending, isError, error };
};
