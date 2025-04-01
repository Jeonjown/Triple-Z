import { useQuery } from "@tanstack/react-query";
import { fetchMonthlyUsers, MonthlyUserData } from "../api/analytics";

export const useFetchMonthlyUsers = () => {
  const { data, isPending, isError, error } = useQuery<MonthlyUserData[]>({
    queryKey: ["users", "monthly"],
    queryFn: fetchMonthlyUsers,
    retry: 1,
  });

  return { data, isPending, isError, error };
};
