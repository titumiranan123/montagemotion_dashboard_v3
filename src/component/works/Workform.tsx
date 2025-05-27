"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import Swal from "sweetalert2";
import { api_url } from "@/hook/Apiurl";
import ReactPlayer from "react-player";

interface IWork {
  id?: string;
  title: string;
  description: string;
  thumbnail: string;
  video_link: string;
  is_visible: boolean;
  is_feature: boolean;
  position?: number;
  type:
    | "main"
    | "shorts"
    | "talking"
    | "podcast"
    | "graphic"
    | "advertising"
    | "website";
  sub_type?:
    | "full"
    | "short"
    | "hook"
    | "thumbnail"
    | "poster"
    | "uiux_design"
    | "web_development"
    | "ovc"
    | "reels";
}

interface IWorkFormProps {
  onSubmit: (data: IWork) => Promise<void> | void;
  initialData?: Partial<IWork | null>;
  onCancel?: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime"];

const Workform: React.FC<IWorkFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IWork>({
    defaultValues: {
      type: "main",
      ...initialData,
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.thumbnail || null
  );
  const [videoPreview, setVideoPreview] = useState<string | null>(
    initialData?.video_link || null
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);

  const selectedType = watch("type");
  const currentImage = watch("thumbnail");
  const currentVideo = watch("video_link");

  // Reset subType when type changes if the new type doesn't support subTypes
  useEffect(() => {
    const typesWithoutSubType = ["main", "shorts", "talking"];
    if (typesWithoutSubType.includes(selectedType)) {
      setValue("sub_type", undefined);
    }
  }, [selectedType, setValue]);

  const getSubTypeOptions = () => {
    switch (selectedType) {
      case "podcast":
        return [
          { value: "full", label: "Full" },
          { value: "short", label: "Short" },
          { value: "hook", label: "Hook" },
        ];
      case "graphic":
        return [
          { value: "thumbnail", label: "Thumbnail" },
          { value: "poster", label: "Poster" },
        ];
      case "website":
        return [
          { value: "uiux_design", label: "UI/UX Design" },
          { value: "web_development", label: "Web Development" },
        ];
      case "advertising":
        return [
          { value: "ovc", label: "OVC" },
          { value: "reels", label: "Reels" },
        ];
      default:
        return [];
    }
  };

  const subTypeOptions = getSubTypeOptions();
  const showSubType = subTypeOptions.length > 0;

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

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

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
        setValue("thumbnail", response.data.url, { shouldValidate: true });
        await Swal.fire("Success!", "Image uploaded successfully", "success");
      } catch (error: any) {
        setImagePreview(currentImage || null);
        await Swal.fire("Upload Failed", "Failed to upload image", "error");
      } finally {
        setIsUploadingImage(false);
      }
    },
    [currentImage, setValue]
  );

const handleVideoUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
        Swal.fire(
          "Invalid File",
          "Only MP4 and MOV videos are allowed",
          "error"
        );
        return;
      }

      if (file.size > MAX_VIDEO_SIZE) {
        Swal.fire("File Too Large", "Maximum video size is 100MB", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setIsUploadingVideo(true);
      try {
        

        const response = await api_url.post(
          "/api/upload-video",
          {
            fileName: file.name,
            contentType: file.type,
          }, // FormData object (no manual Content-Type!)
          {
            withCredentials: true, // Replaces credentials: 'include'
            onUploadProgress: (progressEvent) => {
              // Guard against missing progressEvent.total
              const percentCompleted = progressEvent.total
                ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                : 0;
              setVideoUploadProgress(percentCompleted);
            },
          }
        );

         setValue("video_link", response.data.url, { shouldValidate: true });
        await Swal.fire("Success!", "Video uploaded successfully", "success");
      } catch (error: any) {
        const err = error as AxiosError;
        setVideoPreview(currentVideo || null);
        await Swal.fire("Upload Failed", "Failed to upload video", "error");
      } finally {
        setIsUploadingVideo(false);
      }
    },
    [currentVideo, setValue]
  );

  const onSubmitHandler = async (data: IWork) => {
    try {
      await onSubmit(data);
    } catch (error) {
      const err = error as Error;
      await Swal.fire(
        "Error!",
        err.message || "Failed to submit form",
        "error"
      );
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("thumbnail", "", { shouldValidate: true });
  };

  const handleRemoveVideo = () => {
    setVideoPreview(null);
    setValue("video_link", "", { shouldValidate: true });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="space-y-6 h-[600px] overflow-y-auto  grid grid-cols-1 lg:grid-cols-2 max-w-7xl gap-7 mx-auto p-5 mt-10   "
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 col-span-1 lg:col-span-2">
        <h1 className="lg:col-span-3  font-bold text-2xl border-b border-gray-700 pb-4">
          {initialData?.id ? "Edit Work" : "Create Work"}
        </h1>
        
        {/* Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
            type="text"
            placeholder="Project Title"
            className={`w-full rounded-md p-2.5 bg-gray-800 border ${
              errors.title ? "border-red-500" : "border-gray-700"
            } text-white focus:ring-2 focus:ring-[#1FB5DD] focus:border-[#1FB5DD]`}
          />
          {errors.title && (
            <p className="text-sm text-red-400 mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Description <span className="text-red-500">*</span>
          </label>
          <input
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 2,
                message: "Description must be at least 2 characters",
              },
            })}
            type="text"
            placeholder="Project description"
            className={`w-full rounded-md p-2.5 bg-gray-800 border ${
              errors.description ? "border-red-500" : "border-gray-700"
            } text-white focus:ring-2 focus:ring-[#1FB5DD] focus:border-[#1FB5DD]`}
          />
          {errors.description && (
            <p className="text-sm text-red-400 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            {...register("type", { required: "Type is required" })}
            className={`w-full rounded-md p-2.5 bg-gray-800 border ${
              errors.type ? "border-red-500" : "border-gray-700"
            } text-white focus:ring-2 focus:ring-[#1FB5DD] focus:border-[#1FB5DD]`}
          >
            <option value="main">Main</option>
            <option value="shorts">Shorts</option>
            <option value="talking">Talking Head</option>
            <option value="podcast">Podcast</option>
            <option value="graphic">Graphic</option>
            <option value="advertising">Advertising</option>
            <option value="website">Website</option>
          </select>
          {errors.type && (
            <p className="text-sm text-red-400 mt-1">{errors.type.message}</p>
          )}
        </div>

        {/* Conditional Sub Type */}
        {showSubType && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Sub Type <span className="text-red-500">*</span>
            </label>
            <select
              {...register("sub_type", { 
                required: showSubType ? "Sub Type is required" : false 
              })}
              className={`w-full rounded-md p-2.5 bg-gray-800 border ${
                errors.sub_type ? "border-red-500" : "border-gray-700"
              } text-white focus:ring-2 focus:ring-[#1FB5DD] focus:border-[#1FB5DD]`}
            >
              <option value="">Select Sub Type</option>
              {subTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.sub_type && (
              <p className="text-sm text-red-400 mt-1">
                {errors.sub_type.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Image Upload */}
      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-white font-semibold text-lg mb-4">
          Thumbnail Upload {imageUploadProgress > 0 && `(${imageUploadProgress}%)`}
        </h2>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Thumbnail <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-4">
          <label
            htmlFor="image-upload"
            className={`cursor-pointer flex-1 ${
              isUploadingImage ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed border-gray-600 rounded-md hover:border-gray-500 transition-colors">
              {imagePreview ? (
                <div className="relative group w-full">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-40 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-sm text-gray-300 mt-2">
                    Click to upload image
                  </p>
                  <p className="text-xs text-gray-400">
                    JPG, PNG, WEBP up to 5MB
                  </p>
                </>
              )}
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
        
        <div className="mt-4 space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Thumbnail URL
          </label>
          <input
            {...register("thumbnail", { required: "Thumbnail is required" })}
            type="text"
            placeholder="https://example.com/image.jpg"
            className={`w-full rounded-md p-2.5 bg-gray-700 border ${
              errors.thumbnail ? "border-red-500" : "border-gray-600"
            } text-white focus:ring-2 focus:ring-[#1FB5DD] focus:border-[#1FB5DD]`}
          />
          {errors.thumbnail && (
            <p className="text-sm text-red-400 mt-1">
              {errors.thumbnail.message}
            </p>
          )}
        </div>
      </div>

      {/* Video Upload */}
   { selectedType !== 'website' &&  <div className="bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-white font-semibold text-lg mb-4">
          Video Upload {videoUploadProgress > 0 && `(${videoUploadProgress}%)`}
        </h2>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Video
        </label>
        <div className="flex items-center gap-4">
          <label
            htmlFor="video-upload"
            className={`cursor-pointer flex-1 ${
              isUploadingVideo ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed border-gray-600 rounded-md hover:border-gray-500 transition-colors">
              {videoPreview ? (
                <div className="relative group w-full">
                  <ReactPlayer
                    url={videoPreview}
                    width="100%"
                    height="200px"
                    controls
                    light={imagePreview || true}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveVideo();
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-sm text-gray-300 mt-2">
                    Click to upload video
                  </p>
                  <p className="text-xs text-gray-400">
                    MP4, MOV up to 100MB
                  </p>
                </>
              )}
            </div>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoUpload}
              disabled={isUploadingVideo}
            />
          </label>
        </div>
        
        <div className="mt-4 space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Video URL
          </label>
          <input
            {...register("video_link")}
            placeholder="https://example.com/video.mp4"
            className="w-full rounded-md p-2.5 bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-[#1FB5DD] focus:border-[#1FB5DD]"
          />
        </div>
      </div>}

      {/* Visibility and Featured Toggles */}
      <div className="bg-gray-800 p-6 rounded-lg shadow col-span-1 lg:col-span-2">
        <div className="flex flex-wrap gap-8">
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register("is_visible")}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1FB5DD] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1FB5DD]"></div>
              <span className="ms-3 text-sm font-medium text-gray-300">
                Visible
              </span>
            </label>
          </div>

          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register("is_feature")}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1FB5DD] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1FB5DD]"></div>
              <span className="ms-3 text-sm font-medium text-gray-300">
                Featured
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Submit/Cancel Buttons */}
      <div className="flex justify-end gap-4 col-span-1 lg:col-span-2 pt-4 border-t border-gray-700">
        {onCancel && (
          <button
            type="button"
            onClick={()=>onCancel()}
            className="px-6 py-2.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting }
          className="px-6 py-2.5 bg-[#1FB5DD] text-white rounded-lg    transition-colors focus:outline-none focus:ring-2 focus:ring-[#1FB5DD] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </form>
  );
};

export default Workform;