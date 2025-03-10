// src/hooks/useCreateBlogPost.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CustomError } from "types";
import { toast } from "@/hooks/use-toast";
import { BlogPost, createBlogPost, CreateBlogPostData } from "../api/blogs";

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    BlogPost,
    CustomError,
    CreateBlogPostData
  >({
    mutationFn: createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast({
        title: "Blog Created",
        description: "The blog post has been created successfully.",
      });
    },
    onError: (error: CustomError) => {
      toast({
        title: "Error Creating Blog",
        description:
          error.message || "An error occurred while creating the blog.",
        variant: "destructive",
      });
    },
  });

  return { mutate, isPending, isError, error };
};
