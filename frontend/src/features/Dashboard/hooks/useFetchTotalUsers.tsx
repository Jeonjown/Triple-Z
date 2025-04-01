import { useQuery } from "@tanstack/react-query";
import { fetchTotalUsers } from "../api/analytics";

export const useFetchTotalUsers = () => {
  const { data, isPending, isError, error } = useQuery<number>({
    queryKey: ["users", "total"],
    queryFn: fetchTotalUsers,
    retry: 1,
  });

  return { data, isPending, isError, error };
};
