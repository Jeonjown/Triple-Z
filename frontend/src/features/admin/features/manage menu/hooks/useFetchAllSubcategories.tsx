import { useQuery } from "@tanstack/react-query";
import { getAllSubcategories } from "../api/menu";

const useFetchAllSubcategories = (categoryId: string) => {
  console.log("categoryId", categoryId);
  const { data, isPending, error, isError } = useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: () => getAllSubcategories(categoryId),
    enabled: !!categoryId,
  });

  return { data, isPending, isError, error };
};

export default useFetchAllSubcategories;
