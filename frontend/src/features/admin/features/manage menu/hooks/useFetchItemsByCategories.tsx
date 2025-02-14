import { useQuery } from "@tanstack/react-query";
import { CustomError } from "types";
import { getItemsBasedOnCategories } from "../api/menu";

interface MenuItem {
  _id: string;
  title: string;
  image?: string;
  basePrice?: number | null;
  sizes?: { _id: string; size: string; sizePrice: number }[];
  requiresSizeSelection: boolean;
  description: string;
  availability?: boolean;
  createdAt: string;
  categoryId?: string;
  categoryName?: string;
  subcategoryId?: string;
  subcategoryName?: string;
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
