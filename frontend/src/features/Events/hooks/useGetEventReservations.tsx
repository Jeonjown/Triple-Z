import { useQuery } from "@tanstack/react-query";
import { getEventReservations } from "../api/event";

const useGetEventReservations = () => {
  const { data, isPending, isError, error } = useQuery({
    queryFn: getEventReservations,
    queryKey: ["eventReservations"],
    retry: 1,
  });

  return { data, isPending, isError, error };
};

export default useGetEventReservations;
