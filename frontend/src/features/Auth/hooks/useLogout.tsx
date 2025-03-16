import { useQueryClient } from "@tanstack/react-query";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import { useFCMAdminToken } from "@/features/Notifications/push-notification/useFCMAdminToken";
import { useFCMToken } from "@/features/Notifications/push-notification/useFCMToken";

export const useLogout = () => {
  const { logout: logoutStore } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { requestAdminUnsubscribe } = useFCMAdminToken();
  const { deleteCurrentToken } = useFCMToken();

  const logoutUser = async () => {
    try {
      // Unsubscribe the admin device from notifications
      await requestAdminUnsubscribe();
    } catch (error) {
      console.error("Error during admin unsubscribe:", error);
    }
    // Delete the current FCM token so that a new one is generated on next login
    await deleteCurrentToken();
    logoutStore();
    await logout();
    queryClient.invalidateQueries({ queryKey: ["users"] });
    navigate("/");
  };

  return { logoutUser };
};

export default useLogout;
