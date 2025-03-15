import React from "react";
import { useGetAllBlogPosts } from "../hooks/useGetAllBlogPosts";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const Blogs: React.FC = () => {
  const { data: blogPosts, isPending, isError, error } = useGetAllBlogPosts();
  const navigate = useNavigate();

  const handleBlogClick = (id: string) => {
    navigate(`/blogs/${id}`);
  };

  if (isPending)
    return (
      <div className="container mx-auto grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="h-48 w-full" />
        ))}
      </div>
    );

  if (isError)
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>Error: {error?.message}</AlertDescription>
        </Alert>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
      </header>

      <main className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts?.map((post) => (
          <Card
            key={post._id}
            className="border-none shadow-none transition-transform"
          >
            <CardHeader>
              <img
                src={post.image}
                alt={post.title}
                className="h-48 w-full object-cover"
              />
            </CardHeader>
            {/* On mobile, center text; on larger screens, left align */}
            <CardContent className="px-10 py-2 text-center sm:text-left">
              <CardTitle className="mt-1 text-lg font-semibold">
                {post.title}
              </CardTitle>
              <CardDescription className="text-xs uppercase tracking-wide text-gray-500">
                {post.eventType} •{" "}
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString()
                  : "No date"}
              </CardDescription>
              <p className="mt-4 line-clamp-2 text-xs">{post.content}</p>
              <Button
                onClick={() => handleBlogClick(post._id)}
                className="mx-auto mt-4 rounded hover:text-white sm:mx-0"
              >
                Read Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
};

export default Blogs;
