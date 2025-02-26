import { fetchUser } from "@/api/user";
import { useQuery } from "@tanstack/react-query";

export const useGetUser = (userId?: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId!),
    enabled: !!userId,
  });
};
