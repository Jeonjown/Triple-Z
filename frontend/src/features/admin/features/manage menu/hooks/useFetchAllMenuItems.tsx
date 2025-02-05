import { useQuery } from "@tanstack/react-query";
import { getAllMenuItems } from "../api/menu";

const useFetchAllMenuItems = () => {
  const { data, isPending, isError, error } = useQuery({
    queryFn: getAllMenuItems,
    queryKey: ["menuItems"],
    retry: 1,
  });

  return { data, isPending, isError, error };
};

export default useFetchAllMenuItems;
