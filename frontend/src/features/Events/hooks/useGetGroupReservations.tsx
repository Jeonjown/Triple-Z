// useGetGroupReservations.ts
import { useQuery } from "@tanstack/react-query";
import { getGroupReservations } from "../api/group";

const useGetGroupReservations = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["groupReservations"],
    queryFn: getGroupReservations,
    retry: 1,
  });

  const reservations = data?.reservations;

  return { data: reservations, isPending, isError, error };
};

export default useGetGroupReservations;
