import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "../api/menu";

const useFetchAllCategories = () => {
  const { data, isPending, isError, error } = useQuery({
    queryFn: getAllCategories,
    queryKey: ["categories"],
  });

  return {
    data,
    isPending,
    isError,
    error,
  };
};

export default useFetchAllCategories;
