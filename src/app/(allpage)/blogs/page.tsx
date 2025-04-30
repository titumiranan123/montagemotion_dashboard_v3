'use client';
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import CampaignCardSkeleton from "@/component/service/ServiceSkeleton";
import { api_url } from "@/hook/Apiurl";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import useBlog from "@/hook/useBlog";
import BlogCardHorizontal from "@/component/blogs/Blogcard";
import BlogForm from "@/component/blogs/Blogfrom";


interface IBlog {
  id?: string;
  title: string;
  short_description: string;
  description: string;
  image: string;
  is_publish?: boolean;
  is_feature?: boolean;
  is_position?:number
  created_at?: Date | undefined;
  updated_at?: Date;
}

const Blogs = () => {
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<IBlog | null>(null);
  const { data: blogs = [], isLoading,refetch } = useBlog();
  const [parent, tapes, setTapes] = useDragAndDrop<HTMLDivElement, IBlog>(blogs);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!isLoading && blogs) {
      setTapes(blogs);
    }
  }, [blogs, isLoading]);

  useEffect(() => {
    // Compare tapes with original blogs to detect changes
    const hasPositionChanges = tapes.some((tape, index) => {
      const originalBlog = blogs.find((b:IBlog) => b.id === tape.id);
      return originalBlog && originalBlog.position !== index + 1;
    });
    setHasChanges(hasPositionChanges);
  }, [tapes, blogs]);

  const handleSubmit = async (data: IBlog) => {
    try {
      if (data.id) {
        // Update existing blog
        await api_url.put(`/api/blog/${data.id}`, data);
        Swal.fire({
          title: 'Blog updated successfully!',
          icon: 'success',
          background: '#1f2937',
          color: '#fff',
          confirmButtonColor: '#6366f1'
        });
      } else {
        // Create new blog
        await api_url.post('/api/blog', data);
        Swal.fire({
          title: 'Blog created successfully!',
          icon: 'success',
          background: '#1f2937',
          color: '#fff',
          confirmButtonColor: '#6366f1'
        });
      }
      refetch()
      setShowForm(false);
      setEditData(null);
    } catch (err: any) {
      Swal.fire({
        title: "Error!",
        text: err.message || "Failed to save blog",
        icon: "error",
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#6366f1'
      });
    }
  };

  const savePositions = async () => {
    const payload = tapes.map((item, index) => ({
      id: item.id,
      position: index + 1,
    }));

    try {
        console.log(payload)
      await api_url.patch("/api/blogs/positions", payload);
      Swal.fire({
        title: "Positions updated!",
        icon: "success",
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#6366f1'
      });
      refetch(); // Refresh the data
      setHasChanges(false);
    } catch (err: any) {
console.log(err)
      Swal.fire({
        title: "Failed to update positions!",
        text: err.responsce.data.errorMessage[0].message,
        icon: "error",
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#6366f1'
      });
    }
  };

  const handleEdit = (blog: IBlog) => {
    setEditData(blog);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      background: '#1f2937',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Deleting...',
          text: 'Please wait while we delete the blog post',
          allowOutsideClick: false,
          background: '#1f2937',
          color: '#fff',
          didOpen: () => {
            Swal.showLoading();
          }
        });

        await api_url.delete(`/api/blogs/${id}`);
        refetch(); // Refresh the data

        Swal.fire({
          title: 'Deleted!',
          text: 'Your blog post has been deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: '#1f2937',
          color: '#fff'
        });
      } catch (error) {
        console.error('Error deleting blog:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete the blog post',
          icon: 'error',
          background: '#1f2937',
          color: '#fff'
        });
      }
    }
  };

  const handleTogglePublish = async (id: string, is_publish: boolean) => {
    try {
      await api_url.put(`/api/blogs/${id}`, { is_publish });
      refetch(); // Refresh the data
    } catch (error) {
      console.error('Error toggling publish status:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update publish status',
        icon: 'error',
        background: '#1f2937',
        color: '#fff'
      });
    }
  };

  const handleToggleFeature = async (id: string, is_feature: boolean) => {
    try {
      await api_url.put(`/api/blogs/${id}`, { is_feature });
      refetch(); // Refresh the data
    } catch (error) {
      console.error('Error toggling feature status:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update feature status',
        icon: 'error',
        background: '#1f2937',
        color: '#fff'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Blog Posts</h1>
            <p className="text-gray-400">Manage and organize your blog content</p>
          </div>
          <div className="flex gap-3">
            {hasChanges && (
              <button
                onClick={savePositions}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Save Positions
              </button>
            )}
            <button
              onClick={() => {
                setEditData(null);
                setShowForm(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Add New Blog
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6">
              {[...Array(5)].map((_, idx) => (
                <CampaignCardSkeleton key={idx} />
              ))}
            </div>
          ) : blogs?.length > 0 ? (
            <div ref={parent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tapes.map((blog) => (
                <BlogCardHorizontal
                  key={blog.id}
                  blog={blog}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onTogglePublish={handleTogglePublish}
                  onToggleFeature={handleToggleFeature}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-medium text-gray-300 mb-2">No blogs found</h3>
              <p className="text-gray-500 mb-4">Start by adding your first blog post</p>
              <button
                onClick={() => {
                  setEditData(null);
                  setShowForm(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg"
              >
                Add Blog
              </button>
            </div>
          )}
        </div>

        {/* Blog Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto">
            <div className="w-full max-w-4xl bg-gray-800 rounded-xl p-6">
              <BlogForm
                initialData={editData || undefined}
                onSuccess={() => {
                  setShowForm(false);
                  setEditData(null);
                }}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;