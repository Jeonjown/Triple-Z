import React from "react";
import { useGetAllBlogPosts } from "../hooks/useGetAllBlogPosts";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
          <Skeleton key={index} className="h-48 w-full rounded" />
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
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => handleBlogClick(post._id)}
          >
            <CardHeader>
              <img
                src={post.image}
                alt={post.title}
                className="h-40 w-full rounded object-cover"
              />
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                {post.eventType}
              </p>
              <CardTitle className="mt-2 text-lg font-semibold">
                {post.title}
              </CardTitle>
              <p className="mt-2 text-sm text-gray-500">
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString()
                  : "No date"}
              </p>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
};

export default Blogs;
