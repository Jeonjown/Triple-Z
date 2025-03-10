// Import necessary libraries and hooks
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

const AdminBlog: React.FC = () => {
  // Use a typed useParams to ensure 'id' is a string
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch the blog post details using the custom hook
  const { data: blogPost, isLoading, isError, error } = useGetBlogPost(id!);

  // Display loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Back button to navigate to the previous page */}
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        Back
      </Button>
      <Card className="shadow-lg">
        <CardHeader className="px-6 py-4">
          <CardTitle className="text-3xl font-bold">
            {blogPost?.title}
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            {blogPost?.eventType} •{" "}
            {blogPost?.createdAt
              ? new Date(blogPost.createdAt).toLocaleDateString()
              : "No date"}
          </CardDescription>
        </CardHeader>
        <img
          src={blogPost?.image}
          alt={`Image for ${blogPost?.title}`}
          className="w-full object-cover"
        />
        <CardContent className="px-6 py-4">
          <p className="text-lg">{blogPost?.content}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlog;
