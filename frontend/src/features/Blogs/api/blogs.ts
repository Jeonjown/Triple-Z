// src/api/blogs.ts
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const blogAPI = axios.create({
  baseURL: `${BASE_URL}/api/blogs`,
  withCredentials: true,
});

// TypeScript interface remains for response type
export interface BlogPost {
  _id: string;
  title: string;
  eventType: string;
  content: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

// Get all blog posts
export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  const response = await blogAPI.get("/");
  return response.data;
};

// Get a single blog post
export const getBlogPost = async (id: string): Promise<BlogPost> => {
  const response = await blogAPI.get(`/${id}`);
  return response.data;
};

// Create a new blog post with file upload (FormData)
export const createBlogPost = async (data: FormData): Promise<BlogPost> => {
  const response = await blogAPI.post("/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Update a blog post by ID with file upload (FormData)
export const updateBlogPost = async (
  id: string,
  data: FormData,
): Promise<BlogPost> => {
  // Debug: Log all keys and values in FormData
  data.forEach((value, key) => {
    console.log(key, value);
  });

  const response = await blogAPI.put(`/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Delete a blog post by ID remains unchanged
export const deleteBlogPost = async (
  id: string,
): Promise<{ message: string }> => {
  const response = await blogAPI.delete(`/${id}`);
  return response.data;
};
