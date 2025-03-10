import { useQuery } from "@tanstack/react-query";
import { CustomError } from "types";
import { BlogPost, getBlogPost } from "../api/blogs";

export const useGetBlogPost = (blogId: string) => {
  const { data, isLoading, isError, error } = useQuery<BlogPost, CustomError>({
    queryKey: ["blog", blogId],
    queryFn: () => getBlogPost(blogId),
    enabled: !!blogId,
  });

  return { data, isLoading, isError, error };
};
