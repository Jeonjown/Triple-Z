// src/hooks/useDeleteBlogPost.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CustomError } from "types";
import { toast } from "@/hooks/use-toast";
import { deleteBlogPost } from "../api/blogs";

interface DeleteBlogPostVariables {
  blogId: string;
}

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    { message: string },
    CustomError,
    DeleteBlogPostVariables
  >({
    mutationFn: ({ blogId }: DeleteBlogPostVariables) => deleteBlogPost(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast({
        title: "Blog Deleted",
        description: "The blog post has been deleted successfully.",
      });
    },
    onError: (error: CustomError) => {
      toast({
        title: "Error Deleting Blog",
        description:
          error.message || "An error occurred while deleting the blog.",
        variant: "destructive",
      });
    },
  });

  return { mutate, isPending, isError, error };
};
