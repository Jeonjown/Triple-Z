import { useQuery } from "@tanstack/react-query";
import { getAllSubcategories } from "../manage menu/api/menu";

const useFetchAllSubcategories = (categoryId: string) => {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ["categories", categoryId],
    queryFn: () => getAllSubcategories(categoryId),
    enabled: !!categoryId,
  });

  return { data, isPending, isError, error };
};

export default useFetchAllSubcategories;
