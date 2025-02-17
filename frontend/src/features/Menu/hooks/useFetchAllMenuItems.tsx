import { useQuery } from "@tanstack/react-query";
import { getAllMenuItems } from "../api/menu";
import { CustomError } from "types";
import { MenuItem } from "../pages/ManageMenu";

const useFetchAllMenuItems = () => {
  const { data, isPending, isError, error } = useQuery<MenuItem[], CustomError>(
    {
      queryFn: getAllMenuItems,
      queryKey: ["menuItems"],
      retry: 1,
    },
  );

  return { data, isPending, isError, error };
};

export default useFetchAllMenuItems;
