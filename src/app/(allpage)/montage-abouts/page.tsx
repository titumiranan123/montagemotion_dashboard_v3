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
  alt:string
}

const OurStoryPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  const { data: aboutData, isLoading, refetch } = useAbout();

  const {
    control,
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<StoryData>({
    defaultValues: {
      title: aboutData?.title || "",
      description: aboutData?.description || "",
      image: aboutData?.image || ""
    }
  });

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

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
    if (aboutData) {
      reset({
        title: aboutData.title,
        description: aboutData.description,
        image: aboutData.image
      });
    }
  }, [aboutData, reset]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const onSubmit = async (data: StoryData) => {
    try {
      const response = await api_url.post("/api/about", data);
      setIsEditing(false);
      refetch();
      await Swal.fire("Success!", "Changes saved successfully", "success");
    } catch (error) {
      await Swal.fire("Error!", "Failed to save changes", "error");
    }
  };



  return (
    <div className="min-h-screen text-white">
      <main className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">Our Story</h1>
          <button
            onClick={handleEditClick}
            className="flex items-center gap-2 bg-[#1FB5DD] hover:bg-[#1FB5DD] px-4 py-2 rounded-lg transition-colors"
            disabled={isUploadingImage}
          >
            {isEditing ? <FiX size={20} /> : <FiEdit2 size={20} />}
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        {!isEditing ? (
          <>
          {
            isLoading ? <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-slate-300 rounded-lg animate-pulse h-[500px]">
              
            </div>
            <div className="space-y-6">
              <h3 className="text-4xl font-bold w-52 bg-slate-300 h-10 rounded-lg animate-pulse" ></h3>
              <div
                className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed lg:w-[520px] w-full rounded-lg h-6 bg-slate-300 animate-pulse"
              
              />
              <div
                className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed lg:w-[520px] w-full rounded-lg h-6 bg-slate-300 animate-pulse"
              
              />
              <div
                className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed lg:w-[520px] w-full rounded-lg h-6 bg-slate-300 animate-pulse"
              
              />
              <div
                className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed lg:w-[520px] w-full rounded-lg h-6 bg-slate-300 animate-pulse"
              
              />
              <div
                className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed lg:w-[520px] w-full rounded-lg h-6 bg-slate-300 animate-pulse"
              
              />
              <div
                className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed lg:w-[520px] w-full rounded-lg h-6 bg-slate-300 animate-pulse"
              
              />
              <div
                className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed lg:w-[520px] w-full rounded-lg h-6 bg-slate-300 animate-pulse"
              
              />
            </div>
          </div>:<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src={aboutData?.image || ""}
                alt="Our story"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-4xl font-bold">{aboutData?.title}</h3>
              <div
                className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: aboutData?.description }}
              />
            </div>
          </div>
          }
          </>
        ) : (
          <div className="fixed inset-0 overflow-hidden bg-black/20 bg-opacity-80 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto">
            <div className="w-full max-w-4xl bg-gray-800 rounded-xl p-6">
            <h1 className="border-b font-semibold text-2xl py-2 border-slate-500 mb-3 ">Our Story Update</h1>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 h-[600px] overflow-y-auto p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div>
                    <label className="block text-lg font-medium mb-2">
                      Title
                    </label>
                    <input
                      {...register("title", { required: "Title is required" })}
                      defaultValue={aboutData?.title}
                      className={`w-full bg-gray-700 rounded-lg p-3 border ${
                        errors?.title ? "border-red-500" : "border-gray-600"
                      } focus:border-[#1FB5DD] focus:ring-2 focus:ring-[#1FB5DD]`}
                    />
                    {errors?.title && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors?.title?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-lg font-medium mb-2">
                      Alt
                    </label>
                    <input
                      {...register("alt", { required: "Alt is required" })}
                      defaultValue={aboutData?.alt}
                      className={`w-full bg-gray-700 rounded-lg p-3 border ${
                        errors?.alt ? "border-red-500" : "border-gray-600"
                      } focus:border-[#1FB5DD] focus:ring-2 focus:ring-[#1FB5DD]`}
                    />
                    {errors?.alt && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors?.alt?.message}
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
                            className="bg-[#1FB5DD] h-2.5 rounded-full"
                            style={{ width: `${imageUploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <Controller
                      name="image"
                      control={control}
                      defaultValue={aboutData?.image}
                      render={({ field }) => (
                        <div className="space-y-4">
                          {field.value ? (
                            <div className="relative w-full rounded-lg overflow-hidden group">
                              <Image
                                src={field.value}
                                alt="Current story image"
                                width={320}
                                height={250}
                                className="object-cover w-full"
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
                          ) : (
                            <div className="flex flex-col space-y-4">
                              <label
                                htmlFor="image-upload-main"
                                className={`flex-1 ${
                                  isUploadingImage
                                    ? "opacity-50 pointer-events-none"
                                    : ""
                                }`}
                              >
                                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-xl hover:border-[#1FB5DD] transition cursor-pointer">
                                  <div className="bg-gray-700 p-3 rounded-full mb-3">
                                    <FiUpload size={24} className="text-gray-400" />
                                  </div>
                                  <p className="text-sm text-gray-400 text-center">
                                    <span className="font-medium text-[#1FB5DD] hover:text-[#1FB5DD] transition">
                                      Click to upload
                                    </span>
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    JPG, PNG, WEBP (Max 5MB)
                                  </p>
                                </div>
                                <input
                                  id="image-upload-main"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleImageUpload}
                                  disabled={isUploadingImage}
                                />
                              </label>
                              
                              <div className="space-y-2">
                                <label className="text-sm text-gray-400">Or enter image URL</label>
                                <input
                                  type="text"
                                  {...register("image")}
                                  placeholder="https://example.com/image.jpg"
                                  className="w-full bg-gray-700 rounded-lg p-2 border border-gray-600 focus:border-[#1FB5DD] focus:ring-2 focus:ring-[#1FB5DD]"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-medium mb-2">
                    Content
                  </label>
                  <div className="bg-gray-700 text-black rounded-lg border border-gray-600">
                    <Controller
                      name="description"
                      control={control}
                      defaultValue={aboutData?.description}
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
                              {error?.message}
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
                    className="flex items-center gap-2 bg-[#1FB5DD] hover:bg-green-700 px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <FiSave size={20} />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OurStoryPage;