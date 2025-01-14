import { useEffect } from "react";
import useAuthStore from "../stores/useAuthStore";
import { checkAuth } from "../api/auth";
import { useQuery } from "@tanstack/react-query";

const useFetchUserData = () => {
  const { data } = useQuery({
    queryKey: ["userData"],
    queryFn: checkAuth,
    retry: false,
  });

  const { user, login } = useAuthStore();

  useEffect(() => {
    if (data) {
      login(data);
    }
  }, [data, login]);

  return { user };
};

export default useFetchUserData;
