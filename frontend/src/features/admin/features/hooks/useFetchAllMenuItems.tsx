import { useQuery } from "@tanstack/react-query";
import { getAllMenuItems } from "../manage menu/api/menu";

const useFetchAllMenuItems = () => {
  const { data, isPending, isError, error } = useQuery({
    queryFn: getAllMenuItems,
    queryKey: ["menuItems"],
  });

  return { data, isPending, isError, error };
};

export default useFetchAllMenuItems;
