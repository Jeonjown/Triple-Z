import { useQueryClient } from "@tanstack/react-query";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";

export const useLogout = () => {
  const { logout: logoutStore } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  queryClient.invalidateQueries({ queryKey: ["users"] });
  const logoutUser = async () => {
    logoutStore();
    logout();
    navigate("/");
  };

  return { logoutUser };
};

export default useLogout;
