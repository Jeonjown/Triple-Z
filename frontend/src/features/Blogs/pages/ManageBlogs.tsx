import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllBlogPosts } from "../hooks/useGetAllBlogPosts";
import { useDeleteBlogPost } from "../hooks/useDeleteBlogPost";
import { useUpdateBlogPost } from "../hooks/useUpdateBlogPost";
import { useCreateBlogPost } from "../hooks/useCreateBlogPost";
import { BlogPost } from "../api/blogs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

const ManageBlogs: React.FC = () => {
  const navigate = useNavigate();

  // Fetch blog posts and hooks for delete, update, create
  const { data: blogPosts, isPending, isError, error } = useGetAllBlogPosts();
  const { mutate: deleteBlogPost } = useDeleteBlogPost();
  const { mutate: updateBlogPost, isPending: isUpdating } = useUpdateBlogPost();
  const { mutate: createBlogPost, isPending: isCreating } = useCreateBlogPost();

  // State for editing a blog post
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editEventType, setEditEventType] = useState<string>("");
  const [editContent, setEditContent] = useState<string>("");
  const [editImage, setEditImage] = useState<File | string>("");

  // State for creating a blog post
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newEventType, setNewEventType] = useState<string>("");
  const [newContent, setNewContent] = useState<string>("");
  const [newImage, setNewImage] = useState<File | null>(null);

  // State for deletion dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);

  // Open create modal
  const handleAddPost = (): void => {
    setIsCreateModalOpen(true);
  };

  // Prepare edit state
  const handleEdit = (blog: BlogPost): void => {
    setEditingBlog(blog);
    setEditTitle(blog.title);
    setEditEventType(blog.eventType);
    setEditContent(blog.content);
    setEditImage(blog.image);
  };

  // Trigger deletion dialog
  const handleDeleteClick = (id: string): void => {
    setDeletingBlogId(id);
    setDeleteDialogOpen(true);
  };

  // Confirm deletion
  const confirmDelete = (): void => {
    if (deletingBlogId) {
      deleteBlogPost({ blogId: deletingBlogId });
      setDeletingBlogId(null);
      setDeleteDialogOpen(false);
    }
  };

  // Submit updated blog post
  const handleUpdateSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!editingBlog) return;

    const formData = new FormData();
    formData.append("title", editTitle);
    formData.append("eventType", editEventType);
    formData.append("content", editContent);
    // Append image (new file or existing URL)
    formData.append("image", editImage instanceof File ? editImage : editImage);

    updateBlogPost({ blogId: editingBlog._id, formData });
    setEditingBlog(null);
  };

  // Submit new blog post
  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("eventType", newEventType);
    formData.append("content", newContent);
    if (newImage) {
      formData.append("image", newImage);
    } else {
      alert("Please upload an image.");
      return;
    }
    createBlogPost(formData);
    setIsCreateModalOpen(false);
    setNewTitle("");
    setNewEventType("");
    setNewContent("");
    setNewImage(null);
  };

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Header with consistent styling */}
      <header className="mb-6 flex justify-between text-center">
        <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
        <Button onClick={handleAddPost}>Add Post</Button>
      </header>

      {/* Grid layout matching Blogs component */}
      <main className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts?.map((post) => (
          <Card
            key={post._id}
            className="border-none shadow-none transition-transform hover:border"
          >
            <CardHeader>
              <img
                src={post.image}
                alt={`Image for ${post.title}`}
                className="h-48 w-full object-cover"
              />
            </CardHeader>
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
              <div className="mt-4 flex justify-between">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate(`/manage-blogs/${post._id}`)}
                >
                  View
                </Button>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(post)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(post._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>

      {/* Delete Confirmation Dialog with updated styling */}
      {deleteDialogOpen && (
        <Dialog
          open={deleteDialogOpen}
          onOpenChange={(open) => {
            if (!open) setDeleteDialogOpen(false);
          }}
        >
          <DialogContent className="max-h-[80vh] max-w-4xl overflow-auto">
            <DialogHeader>
              <DialogTitle>Delete Blog Post</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this blog post?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setDeletingBlogId(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
            <DialogClose className="absolute right-4 top-4" />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Blog Post Modal with centered file upload */}
      {editingBlog && (
        <Dialog open={true} onOpenChange={() => setEditingBlog(null)}>
          <DialogContent className="max-h-[80vh] max-w-4xl overflow-auto">
            <DialogHeader>
              <DialogTitle>Edit Blog Post</DialogTitle>
              <DialogDescription>
                Update the details for the blog post.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {/* Title input */}
              <div>
                <label
                  htmlFor="edit-title"
                  className="block text-sm font-medium"
                >
                  Title
                </label>
                <input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="mt-1 block w-full rounded border px-3 py-2"
                  required
                />
              </div>
              {/* Event Type input */}
              <div>
                <label
                  htmlFor="edit-eventType"
                  className="block text-sm font-medium"
                >
                  Event Type
                </label>
                <input
                  id="edit-eventType"
                  value={editEventType}
                  onChange={(e) => setEditEventType(e.target.value)}
                  className="mt-1 block w-full rounded border px-3 py-2"
                  required
                />
              </div>
              {/* Content input */}
              <div>
                <label
                  htmlFor="edit-content"
                  className="block text-sm font-medium"
                >
                  Content
                </label>
                <textarea
                  id="edit-content"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="mt-1 block h-80 w-full rounded border px-3 py-2"
                  rows={4}
                  required
                />
              </div>
              {/* Centered File Upload */}
              <div className="flex flex-col items-center">
                <p className="text-center text-sm">Current Image:</p>
                {typeof editImage === "string" && (
                  <img
                    src={editImage}
                    alt="Current"
                    className="mx-auto mb-2 w-1/2 object-cover"
                  />
                )}
                <label
                  htmlFor="edit-image"
                  className="mt-5 block text-center text-sm font-medium"
                >
                  Upload New Image (optional)
                </label>
                <input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setEditImage(e.target.files[0]);
                    }
                  }}
                  className="mx-auto mt-2 block w-1/2 p-1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setEditingBlog(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update"}
                </Button>
              </div>
            </form>
            <DialogClose className="absolute right-4 top-4" />
          </DialogContent>
        </Dialog>
      )}

      {/* Create Blog Post Modal with centered file upload */}
      {isCreateModalOpen && (
        <Dialog open={true} onOpenChange={() => setIsCreateModalOpen(false)}>
          <DialogContent className="max-h-[80vh] max-w-4xl overflow-auto">
            <DialogHeader>
              <DialogTitle>Create Blog Post</DialogTitle>
              <DialogDescription>
                Fill out the form to add a new blog post.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Title input */}
              <div>
                <label
                  htmlFor="new-title"
                  className="block text-sm font-medium"
                >
                  Title
                </label>
                <input
                  id="new-title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-1 block w-full rounded border px-3 py-2"
                  required
                />
              </div>
              {/* Event Type input */}
              <div>
                <label
                  htmlFor="new-eventType"
                  className="block text-sm font-medium"
                >
                  Event Type
                </label>
                <input
                  id="new-eventType"
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value)}
                  className="mt-1 block w-full rounded border px-3 py-2"
                  required
                />
              </div>
              {/* Content input */}
              <div>
                <label
                  htmlFor="new-content"
                  className="block text-sm font-medium"
                >
                  Content
                </label>
                <textarea
                  id="new-content"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="mt-1 block w-full rounded border px-3 py-2"
                  rows={4}
                  required
                />
              </div>
              {/* Centered File Upload */}
              <div className="flex flex-col items-center">
                <label
                  htmlFor="new-image"
                  className="block p-1 text-center text-sm font-medium"
                >
                  Upload Image
                </label>
                <input
                  id="new-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewImage(e.target.files[0]);
                    }
                  }}
                  className="mx-auto mt-1 block w-1/2"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
            <DialogClose className="absolute right-4 top-4" />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ManageBlogs;
