"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { FiUpload, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import Image from "next/image";
import MyTextEditor from "@/component/Texteditor";
import { api_url } from "@/hook/Apiurl";

interface IBlog {
  id?: string;
  title: string;
  short_description: string;
  description: string;
  image: string;
  alt: string;
  is_publish?: boolean;
  is_feature?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
interface BlogFormProps {
  initialData?: IBlog;
  onSuccess?: () => void;
  onSubmit: (data: IBlog) => Promise<void>;
  refetch: () => void;
}
const BlogForm: React.FC<BlogFormProps> = ({
  initialData,
  onSuccess,
  refetch,
}) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<IBlog>({
    defaultValues: initialData || {
      title: "",
      short_description: "",
      description: "",
      alt: "",
      image: "",
      is_publish: false,
      is_feature: false,
    },
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  // Set initial data if provided
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      Swal.fire(
        "Invalid File",
        "Only JPG, PNG, and WEBP images are allowed",
        "error"
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      Swal.fire("File Too Large", "Maximum file size is 5MB", "error");
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api_url.post<{ url: string }>(
        "/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setImageUploadProgress(percentCompleted);
          },
        }
      );

      setValue("image", response.data.url, { shouldDirty: true });
      await Swal.fire("Success!", "Image uploaded successfully", "success");
    } catch (error) {
      await Swal.fire("Upload Failed", "Failed to upload image", "error");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setValue("image", "", { shouldDirty: true });
  };

  const onSubmit = async (data: IBlog) => {
    try {
      if (data.id) {
        // Update existing blog
        await api_url.put(`/api/blogs/${data.id}`, data);
        refetch();
        Swal.fire("Success!", "Blog updated successfully", "success");
      } else {
        await api_url.post("/api/blogs", data);
        refetch();
        Swal.fire("Success!", "Blog created successfully", "success");
      }
      onSuccess?.();
    } catch (error: any) {
      Swal.fire(
        "Error!",
        error.response.data.errorMessages[0].message,
        "error"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 h-[650px] overflow-y-auto p-4"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <h2 className="text-2xl font-bold text-white mb-6 pb-4 border-b border-gray-700">
          {initialData?.id ? "Edit Blogs" : "Create New Blogs"}
        </h2>
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Title*
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              className={`w-full p-2 border rounded-md ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Blog title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Short Description*
            </label>
            <textarea
              {...register("short_description", {
                required: "Short description is required",
              })}
              rows={3}
              className={`w-full p-2 border rounded-md ${
                errors.short_description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Brief summary of the blog"
            />
            {errors.short_description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.short_description.message}
              </p>
            )}
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Alt*
            </label>
            <input
              {...register("alt", { required: "Alt is required" })}
              className={`w-full p-2 border rounded-md ${
                errors.alt ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="alt"
            />
            {errors.alt && (
              <p className="mt-1 text-sm text-red-600">
                {errors.alt.message}
              </p>
            )}
          </div>
          {/* Right Column */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Featured Image*
              </label>
              {isUploadingImage && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-200 mb-1">
                    <span>Uploading...</span>
                    <span>{imageUploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-[#1FB5DD] h-2.5 rounded-full"
                      style={{ width: `${imageUploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <Controller
                name="image"
                control={control}
                rules={{ required: "Image is required" }}
                render={({ field, fieldState: { error } }) => (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {field.value && (
                        <div className="relative lg:w-[350px] lg:h-[250px] rounded-md overflow-hidden border">
                          <Image
                            src={field.value}
                            alt="Blog featured image"
                            width={350}
                            height={250}
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      )}

                      <label
                        htmlFor="image-upload"
                        className={`flex-1  ${
                          isUploadingImage
                            ? "opacity-50 pointer-events-none"
                            : ""
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed lg:w-[350px] lg:h-[250px] border-gray-300 rounded-md hover:border-blue-500 transition cursor-pointer">
                          <div className="bg-gray-100 p-2 rounded-full mb-2">
                            <FiUpload size={20} className="text-gray-500" />
                          </div>
                          <p className="text-sm text-gray-600 text-center">
                            <span className="font-medium text-blue-500 hover:text-blue-400 transition">
                              Click to upload
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG, WEBP (Max 5MB)
                          </p>
                        </div>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={isUploadingImage}
                        />
                      </label>
                    </div>
                    {error && (
                      <p className="mt-1 text-sm text-red-600">
                        {error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Publish Status */}
              <div className="p-4 border rounded-md">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register("is_publish")}
                    className="rounded text-[#1FB5DD]"
                  />
                  <span className="text-sm font-medium text-gray-200">
                    Publish
                  </span>
                </label>
              </div>

              {/* Feature Status */}
              <div className="p-4 border rounded-md">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register("is_feature")}
                    className="rounded text-[#1FB5DD]"
                  />
                  <span className="text-sm font-medium text-gray-200">
                    Featured Post
                  </span>
                </label>
              </div>
            </div>
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm  font-medium text-gray-200 mb-1">
              Description*
            </label>
            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <MyTextEditor
                    error={error?.message || ""}
                    value={field.value}
                    onChange={field.onChange}
                  />
                  {error && (
                    <p className="mt-1 text-sm text-red-600">{error.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => onSuccess?.()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-200 hover:bg-[#1FB5DD]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1FB5DD]    disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save Blog"}
        </button>
      </div>
    </form>
  );
};

export default BlogForm;
