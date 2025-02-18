import { useQuery } from "@tanstack/react-query";

import { getReservations } from "../api/event";

const useGetReservations = () => {
  const { data, isPending, isError, error } = useQuery({
    queryFn: getReservations,
    queryKey: ["eventReservations"],
    retry: 1,
  });

  return { data, isPending, isError, error };
};

export default useGetReservations;
