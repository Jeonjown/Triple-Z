import { useQuery } from "@tanstack/react-query";
import { getMenu } from "../api/menu";
import { CustomError } from "types";

interface Menu {
  _id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
}

export const useFetchMenu = () => {
  const { data, isPending, isError, error } = useQuery<Menu[], CustomError>({
    queryFn: getMenu,
    queryKey: ["menu"],
    retry: 1,
  });

  return { data, isPending, isError, error };
};
