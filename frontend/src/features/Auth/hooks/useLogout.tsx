import { useQueryClient } from "@tanstack/react-query";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import { useServiceworker } from "@/notifications/hooks/useServiceWorker";

export const useLogout = () => {
  const { unsubscribe } = useServiceworker();
  const { logout: logoutStore } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Invalidate any cached queries if needed.
  queryClient.invalidateQueries({ queryKey: ["users"] });

  const logoutUser = async () => {
    try {
      // First, unsubscribe from push notifications.
      await unsubscribe();
    } catch (error) {
      console.error("Error during unsubscribe:", error);
    }
    // Update auth store, call API logout, and navigate away.
    logoutStore();
    await logout();
    navigate("/");
  };

  return { logoutUser };
};

export default useLogout;
