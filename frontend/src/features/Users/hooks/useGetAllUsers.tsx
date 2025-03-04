import { getAllUsers } from "@/api/user";
import { useQuery } from "@tanstack/react-query";
import { User } from "../pages/ManageUsers";
import { CustomError } from "types";

export const useGetAllUsers = () => {
  const { data, isPending, isError, error } = useQuery<User[], CustomError>({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  return { data, isPending, isError, error };
};
