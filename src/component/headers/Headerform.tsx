import { api_url } from "@/hook/Apiurl";
import { IHeader } from "@/interface/interface";
import { AxiosError } from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import ReactPlayer from "react-player";
import Swal from "sweetalert2";

interface IHeaderFormProps {
  defaultValues?: IHeader;
  onSubmit: SubmitHandler<IHeader>;
  isSubmitting: boolean;
  onCancel?: () => void;
}

const HeaderForm: React.FC<IHeaderFormProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
  const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime"];

  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultValues?.thumbnail || null
  );
  const [videoPreview, setVideoPreview] = useState<string | null>(
    defaultValues?.video_link || null
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [imageuploadProgress, setImageUploadProgress] = useState(0);
  const [videouploadProgress, setVideoUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IHeader>({
    defaultValues: defaultValues,
  });

  const [selectedType, setSelectedType] = useState<
    | "main"
    | "shorts"
    | "talking"
    | "podcast"
    | "graphic"
    | "advertising"
    | "website"
  >(defaultValues?.type || "main");

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
      setSelectedType(defaultValues.type);
    }
  }, [defaultValues, reset]);
  const currentImage = watch("thumbnail");
  const currentVideo = watch("video_link");

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
        console.log(error);
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
              setVideoUploadProgress(percentCompleted);
            },
          }
        );

        setValue("video_link", response.data.url, { shouldValidate: true });
        await Swal.fire("Success!", "Video uploaded successfully", "success");
      } catch (error: any) {
        const err = error as AxiosError;
        console.error("Video upload failed:", err);
        setVideoPreview(currentVideo || null);
        await Swal.fire("Upload Failed", "Failed to upload video", "error");
      } finally {
        setIsUploadingVideo(false);
      }
    },
    [currentVideo, setValue]
  );

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("thumbnail", "", { shouldValidate: true });
  };

  const handleRemoveVideo = () => {
    setVideoPreview(null);
    setValue("video_link", "", { shouldValidate: true });
  };
  const typeOptions = [
    { value: "main", label: "Main" },
    { value: "shorts", label: "Shorts" },
    { value: "talking", label: "Talking" },
    { value: "podcast", label: "Podcast" },
    { value: "graphic", label: "Graphic" },
    { value: "advertising", label: "Advertising" },
    { value: "website", label: "Website" },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6  w-full max-w-7xl mt-10 bg-[#1E2939] lg:px-10 lg:py-4 px-2 py-2 grid grid-cols-1 lg:grid-cols-2 gap-10"
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-100"
        >
          Title *
        </label>
        <input
          id="title"
          type="text"
          {...register("title", { required: "Title is required" })}
          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm bg-[#101828] focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.title ? "border-red-500" : "border"
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-100 rounded-lg"
        >
          Description *
        </label>
        <textarea
          id="description"
          rows={3}
          {...register("description", { required: "Description is required" })}
          className={`mt-1 p-2 block bg-[#101828] w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.description ? "border-red-500" : "border"
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <h2 className="text-white font-[600] text-lg ">
          Image upload progress: {imageuploadProgress}%
        </h2>
        <label className="block mt-1 text-sm font-medium text-gray-100 mb-1">
          Thumbnail <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-4 mt-2 bg-[#101828]">
          <label
            htmlFor="image-upload"
            className={`cursor-pointer flex-1 ${
              isUploadingImage ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400">
              {imagePreview ? (
                <div className="relative group bg-[#101828]">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
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
                  <p className="text-sm text-gray-600 mt-2">
                    Click to upload image
                  </p>
                  <p className="text-xs text-gray-500">
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
        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-100 mb-1">
            Thumbnail URL :
          </label>
          <input
            {...register("thumbnail")}
            type="text"
            placeholder="CEO, Company Inc."
            className={`w-full bg-[#101828] rounded-md p-2 border ${
              errors.thumbnail ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.thumbnail && (
            <p className="text-sm text-red-600 mt-1">
              {errors.thumbnail.message}
            </p>
          )}
        </div>
      </div>

      {/* Video Upload */}
      <div>
        <h2 className="text-white font-[600] text-lg">
          Video upload progress: {videouploadProgress}%
        </h2>
        <label className="block text-sm font-medium text-gray-100  mt-2 mb-4">
          Upload Video :
        </label>
        <div className="flex items-center gap-4 bg-[#101828]">
          <label
            htmlFor="video-upload"
            className={`cursor-pointer flex-1 ${
              isUploadingVideo ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400">
              {videoPreview ? (
                <div className="relative group w-full">
                  <ReactPlayer
                    url={videoPreview}
                    width="100%"
                    height="200px"
                    controls
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveVideo();
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
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
                  <p className="text-sm text-gray-600 mt-2">
                    Click to upload video
                  </p>
                  <p className="text-xs text-gray-500">MP4, MOV up to 100MB</p>
                </>
              )}
            </div>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              className="hidden "
              onChange={handleVideoUpload}
              disabled={isUploadingVideo}
            />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-100 mb-3 mt-4">
            Video Url (url)
          </label>
          <input
            {...register("video_link")}
            placeholder="Enter testimonial message (optional)"
            className="w-full rounded-md p-2 border border-gray-300 bg-[#101828]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-100">
          Active Status *
        </label>
        <div className="mt-1 space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="true"
              {...register("isActive", {
                required: "Active status is required",
              })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-100">Active</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="false"
              {...register("isActive")}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-100">Inactive</span>
          </label>
        </div>
        {errors.isActive && (
          <p className="mt-1 text-sm text-red-600">{errors.isActive.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-100"
        >
          Type *
        </label>
        <select
          id="type"
          {...register("type", { required: "Type is required" })}
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as any)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-[#101828] focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 ${
            errors.type ? "border-red-500" : "border"
          }`}
        >
          {typeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      <div className="flex justify-center items-center col-span-2 gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default HeaderForm;
