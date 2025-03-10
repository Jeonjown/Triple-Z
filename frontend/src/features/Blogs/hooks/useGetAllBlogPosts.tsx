import { useQuery } from "@tanstack/react-query";
import { CustomError } from "types";
import { BlogPost, getAllBlogPosts } from "../api/blogs";

export const useGetAllBlogPosts = () => {
  const { data, isPending, isError, error } = useQuery<BlogPost[], CustomError>(
    {
      queryKey: ["blogs"],
      queryFn: getAllBlogPosts,
    },
  );

  return { data, isPending, isError, error };
};
