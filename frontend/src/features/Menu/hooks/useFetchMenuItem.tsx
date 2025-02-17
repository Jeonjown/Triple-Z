import { useQuery } from "@tanstack/react-query";
import { CustomError } from "types";
import { getMenuItem } from "../api/menu";

export interface MenuItem {
  _id: string;
  title: string;
  image?: string;
  basePrice?: number | null;
  sizes?: { _id: string; size: string; sizePrice: number }[];
  requiresSizeSelection: boolean;
  description: string;
  availability?: boolean;
  createdAt: string;
  category?: { _id: string; category: string };
  subcategory?: { _id: string; subcategory: string };
}

export const useFetchMenuItem = (menuItemId: string) => {
  return useQuery<MenuItem, CustomError>({
    queryKey: ["menuItems", menuItemId],
    queryFn: () => getMenuItem(menuItemId),
    enabled: !!menuItemId,
    retry: 1,
  });
};
