// src/components/BlogPosts.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetBlogPost } from "../hooks/useGetBlogPost";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const BlogPosts: React.FC = () => {
  // Get blog post id from the URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: blogPost, isLoading, isError, error } = useGetBlogPost(id!);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        Back
      </Button>
      <Card className="mx-auto w-full max-w-4xl border-none shadow-none">
        <img
          src={blogPost?.image}
          alt={`Image for ${blogPost?.title}`}
          className="h-auto w-full object-cover"
        />
        <CardHeader className="mt-5 px-4 py-4 sm:px-6 md:px-8">
          <CardTitle className="text-2xl font-bold sm:text-3xl">
            {blogPost?.title}
          </CardTitle>
          <CardDescription className="text-xs text-gray-500 sm:text-sm">
            {blogPost?.eventType} •{" "}
            {blogPost?.createdAt
              ? new Date(blogPost.createdAt).toLocaleDateString()
              : "No date"}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 py-4 sm:px-6 md:px-8">
          <p className="whitespace-pre-line">{blogPost?.content}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogPosts;
