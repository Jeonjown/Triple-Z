// src/hooks/useUpdateBlogPost.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CustomError } from "types";
import { toast } from "@/hooks/use-toast";
import { BlogPost, updateBlogPost } from "../api/blogs";

// Remove blogId from the hook parameters and expect it when calling mutate.
export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    BlogPost,
    CustomError,
    { blogId: string; formData: FormData } // pass blogId along with FormData
  >({
    mutationFn: ({ blogId, formData }) => updateBlogPost(blogId, formData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog", variables.blogId] });
      toast({
        title: "Blog Updated",
        description: "The blog post has been updated successfully.",
      });
    },
    onError: (error: CustomError) => {
      toast({
        title: "Error Updating Blog",
        description:
          error.message || "An error occurred while updating the blog.",
        variant: "destructive",
      });
    },
  });

  return { mutate, isPending, isError, error };
};
