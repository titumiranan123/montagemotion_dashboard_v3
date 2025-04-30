"use client";
import Image from "next/image";
import React, { useState, useCallback, useEffect } from "react";
import { FiEdit2, FiX, FiSave, FiUpload, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import { api_url } from "@/hook/Apiurl";
import MyTextEditor from "@/component/Texteditor";
import { Controller, useForm } from "react-hook-form";
import useAbout from "@/hook/useAbout";

interface StoryData {
  id?: string;
  title: string;
  description: string;
  image: string;
  is_feature:boolean
  is_publish:boolean
}

const OurStoryPage = () => {
  const [isEditing, setIsEditing] = useState(false);
const [editData,setEditData] = useState<StoryData>()
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<StoryData>(
    {
        defaultValues:editData
    }
  );

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

  const { data: aboutData, isLoading } = useAbout();
  console.log(aboutData);
  const handleContentChange = (value: string) => {
    setValue("description", value, { shouldDirty: true });
  };

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [setValue]
  );

  const handleRemoveImage = () => {
    setValue("image", "", { shouldDirty: true });
  };
  useEffect(() => {
    if (editData) {
      reset(editData);
    }
  }, [editData, reset]);
  
  const handleEditClick = () => {
    setEditData(aboutData);
    setIsEditing(!isEditing);
  };
  const onSubmit = async (data: StoryData) => {
    try {
      const response = await api_url.post("/api/about", data);
      setValue("id", response.data.id);
      setIsEditing(false);
      await Swal.fire("Success!", "Changes saved successfully", "success");
    } catch (error) {
      await Swal.fire("Error!", "Failed to save changes", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">Our Story</h1>
          <button
            onClick={handleEditClick}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            disabled={isUploadingImage}
          >
            {isEditing ? <FiX size={20} /> : <FiEdit2 size={20} />}
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>
        {isLoading ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl bg-gray-700" />

              <div className="space-y-6 lg:mt-[120px]">
                <div className="h-10 bg-gray-700 rounded w-2/3" />
                <div className="space-y-4">
                  <div className="h-4 bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-700 rounded w-5/6" />
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src={aboutData?.image}
                alt="Our story"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="space-y-6">
              <h3 className="text-4xl font-bold">{aboutData.title}</h3>

              <div
                className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: aboutData.description }}
              />
            </div>
          </div>
        )}
        {isEditing && (
          <div className="fixed inset-0 bg-black  bg-opacity-50 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-black max-w-2xl border p-5 rounded-2xl ">
              <div className="grid grid-cols-1  gap-12">
                <div>
                  <label className="block text-lg font-medium mb-2">
                    Title
                  </label>
                  <input
                    {...register("title", { required: "Title is required" })}
                    className={`w-full bg-gray-700 rounded-lg p-3 border ${
                      errors.title ? "border-red-500" : "border-gray-600"
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-lg font-medium mb-2">
                    Image
                  </label>
                  {isUploadingImage && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Uploading...</span>
                        <span>{imageUploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${imageUploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <Controller
                    name="image"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4">
                        {field.value && (
                          <div className="relative w-full rounded-lg overflow-hidden group">
                            <Image
                              src={field.value}
                              alt="Current story image"
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                              aria-label="Remove image"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        )}

                        <label
                          htmlFor="image-upload"
                          className={`flex-1 ${
                            isUploadingImage
                              ? "opacity-50 pointer-events-none"
                              : ""
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-xl hover:border-blue-500 transition cursor-pointer">
                            <div className="bg-gray-700 p-3 rounded-full mb-3">
                              <FiUpload size={24} className="text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-400 text-center">
                              <span className="font-medium text-blue-400 hover:text-blue-300 transition">
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
                    )}
                  />

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Image URL (alternative)
                    </label>
                    <input
                      {...register("image")}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium mb-2">
                  Content
                </label>
                <div
                  className="bg-gray-700 text-black
               rounded-lg border border-gray-600"
                >
                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: "Content is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <MyTextEditor
                          error={error?.message || ""}
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            handleContentChange(value);
                          }}
                        />
                        {error && (
                          <p className="mt-1 text-sm text-red-600">
                            {error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors"
                >
                  <FiX size={20} />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingImage || !isDirty}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  <FiSave size={20} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default OurStoryPage;
