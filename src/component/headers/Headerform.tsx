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
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);

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

  const currentImage = watch("thumbnail");
  const currentVideo = watch("video_link");

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

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
        const err = error as AxiosError;
        console.error("Image upload failed:", err);
        setImagePreview(currentImage || null);
        await Swal.fire(
          "Upload Failed",
          "Failed to upload image",
          "error"
        );
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
      className="space-y-6 w-full  mt-8   rounded-xl shadow-xl p-6 lg:p-8 h-[580px] overflow-y-scroll"
    >
      <h2 className="text-2xl font-bold text-white mb-6 pb-4 border-b border-gray-700">
        {defaultValues?.id ? "Edit Header" : "Create New Header"}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-300">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            {...register("title", { required: "Title is required" })}
            className={`w-full px-4 py-2.5 rounded-lg bg-gray-800 border ${
              errors.title ? "border-red-500" : "border-gray-700"
            } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1FB5DD] focus:border-transparent transition-all`}
            placeholder="Enter header title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
          )}
        </div>

        {/* Type */}
        <div className="space-y-2">
          <label htmlFor="type" className="block text-sm font-medium text-gray-300">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            {...register("type", { required: "Type is required" })}
            className={`w-full px-4 py-2.5 rounded-lg bg-gray-800 border ${
              errors.type ? "border-red-500" : "border-gray-700"
            } text-white focus:outline-none focus:ring-2 focus:ring-[#1FB5DD] focus:border-transparent appearance-none`}
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-400">{errors.type.message}</p>
          )}
        </div>

        {/* Description (full width) */}
        <div className="space-y-2 lg:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            {...register("description", { required: "Description is required" })}
            className={`w-full px-4 py-2.5 rounded-lg bg-gray-800 border ${
              errors.description ? "border-red-500" : "border-gray-700"
            } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1FB5DD] focus:border-transparent transition-all`}
            placeholder="Enter detailed description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="book_link" className="block text-sm font-medium text-gray-300">
            Book Link <span className="text-red-500">*</span>
          </label>
          <input
            id="book_link"
            type="text"
            {...register("book_link", { required: "Book link is required" })}
            className={`w-full px-4 py-2.5 rounded-lg bg-gray-800 border ${
              errors.title ? "border-red-500" : "border-gray-700"
            } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1FB5DD] focus:border-transparent transition-all`}
            placeholder="Enter Meeting bookig link"
          />
          {errors.book_link && (
            <p className="mt-1 text-sm text-red-400">{errors.book_link.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="alt" className="block text-sm font-medium text-gray-300">
            Alt <span className="text-red-500">*</span>
          </label>
          <input
            id="alt"
            type="text"
            {...register("alt", { required: "Alt is required" })}
            className={`w-full px-4 py-2.5 rounded-lg bg-gray-800 border ${
              errors.alt ? "border-red-500" : "border-gray-700"
            } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1FB5DD] focus:border-transparent transition-all`}
            placeholder="Enter header title"
          />
          {errors.alt && (
            <p className="mt-1 text-sm text-red-400">{errors.alt.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div className="space-y-4 bg-gray-800 p-4 rounded-xl ">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-white">Thumbnail</h3>
              <p className="text-sm text-gray-400">
                {imageUploadProgress > 0 ? `Uploading: ${imageUploadProgress}%` : "JPG, PNG, WEBP up to 5MB"}
              </p>
            </div>
            {imagePreview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-sm text-red-400 hover:text-red-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Remove
              </button>
            )}
          </div>
          
          <label
            htmlFor="image-upload"
            className={`block cursor-pointer ${isUploadingImage ? "opacity-50 pointer-events-none" : ""}`}
          >
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-500 transition-colors">
              {imagePreview ? (
                <div className="relative w-full h-48">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-md"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-500"
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
                  <p className="mt-2 text-sm text-gray-300">
                    Click to upload or drag and drop
                  </p>
                </div>
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
          
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Thumbnail URL
            </label>
            <input
              {...register("thumbnail", { required: "Thumbnail is required" })}
              type="text"
              className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${
                errors.thumbnail ? "border-red-500" : "border-gray-600"
              } text-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.thumbnail && (
              <p className="mt-1 text-sm text-red-400">{errors.thumbnail.message}</p>
            )}
          </div>
        </div>

        {/* Video Upload */}
        <div className="space-y-4 bg-gray-800 p-4 rounded-xl ">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-white">Video</h3>
              <p className="text-sm text-gray-400">
                {videoUploadProgress > 0 ? `Uploading: ${videoUploadProgress}%` : "MP4, MOV up to 100MB"}
              </p>
            </div>
            {videoPreview && (
              <button
                type="button"
                onClick={handleRemoveVideo}
                className="text-sm text-red-400 hover:text-red-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Remove
              </button>
            )}
          </div>
          
          <label
            htmlFor="video-upload"
            className={`block cursor-pointer ${isUploadingVideo ? "opacity-50 pointer-events-none" : ""}`}
          >
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-500 transition-colors">
              {videoPreview ? (
                <div className="relative w-full">
                  <ReactPlayer
                    url={videoPreview}
                    width="100%"
                    height="200px"
                    controls
                    light={imagePreview || true}
                  />
                </div>
              ) : (
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-500"
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
                  <p className="mt-2 text-sm text-gray-300">
                    Click to upload or drag and drop
                  </p>
                </div>
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
          
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Video URL
            </label>
            <input
              {...register("video_link")}
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="https://example.com/video.mp4"
            />
          </div>
        </div>

     
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-lg bg-[#1FB5DD] text-white  transition-colors focus:outline-none focus:ring-2 focus:ring-[#1FB5DD] focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
};

export default HeaderForm;