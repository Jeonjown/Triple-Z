import { useQuery } from "@tanstack/react-query";
import { CustomError } from "types";
import { getItemsBasedOnCategories } from "../api/menu";

interface MenuItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  image: string;
}

export const useFetchItemsByCategories = (
  categoryId: string,
  subcategoryId: string,
) => {
  return useQuery<MenuItem[], CustomError>({
    queryKey: ["menuItems", categoryId, subcategoryId],
    queryFn: () => getItemsBasedOnCategories(categoryId, subcategoryId),
    enabled: !!categoryId && !!subcategoryId,
    retry: 1,
  });
};
