import { useQueryClient } from "@tanstack/react-query";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import { useFCMToken } from "@/features/Notifications/push-notification/useFCMToken";

export const useLogout = () => {
  const { user, logout: logoutStore } = useAuthStore();
  const { deleteCurrentToken } = useFCMToken(
    user?._id,
    user?.role as "admin" | "user" | undefined,
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutUser = async () => {
    logoutStore();
    await deleteCurrentToken();
    await logout();
    queryClient.invalidateQueries({ queryKey: ["users"] });
    navigate("/");
  };

  return { logoutUser };
};

export default useLogout;
