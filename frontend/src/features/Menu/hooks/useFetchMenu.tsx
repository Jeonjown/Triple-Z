import { useQuery } from "@tanstack/react-query";
import { getMenu } from "../api/menu";
import { CustomError } from "types";

interface Subcategory {
  _id: string;
  subcategory: string;
}

interface Category {
  _id: string;
  category: string;
  subcategories: Subcategory[];
}

interface MenuData {
  categories: Category[];
}

export const useFetchMenu = () => {
  const { data, isPending, isError, error } = useQuery<MenuData, CustomError>({
    queryFn: getMenu,
    queryKey: ["menu"],
    retry: 1,
  });

  return { data, isPending, isError, error };
};
