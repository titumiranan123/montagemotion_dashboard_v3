'use client';
import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import  { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import { api_url } from '@/hook/Apiurl';
import ReactPlayer from "react-player";


    interface IWork {
        id?: string;
        title:string
        description:string;
        thumbnail: string;
        video_link: string;
        isVisible: boolean;
        isFeature:boolean
        position?: number;
        type: "main" |"shorts" | "talking" | "podcast" | "graphic" | "advertising" | "website" ; 
      }


interface IWorkFormProps {
  onSubmit: (data: IWork) => Promise<void> | void;
  initialData?: Partial<IWork | null>;
  onCancel?: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime'];

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
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IWork>({
    defaultValues: {
      type: 'main',
      ...initialData,
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.thumbnail || null);
  const [videoPreview, setVideoPreview] = useState<string | null>(initialData?.video_link || null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [imageuploadProgress, setImageUploadProgress] = useState(0);
  const [videouploadProgress, setVideoUploadProgress] = useState(0);
  
  const selectedType = watch('type');
  const currentImage = watch('thumbnail');
  const currentVideo = watch('video_link');

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        Swal.fire('Invalid File', 'Only JPG, PNG, and WEBP images are allowed', 'error');
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        Swal.fire('File Too Large', 'Maximum file size is 5MB', 'error');
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
        formData.append('thumbnail', file);

        const response = await api_url.post<{ url: string }>('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setImageUploadProgress(percentCompleted)
          },
        });
        setValue('thumbnail', response.data.url, { shouldValidate: true });
        await Swal.fire('Success!', 'Image uploaded successfully', 'success');
      } catch (error: any) {
        setImagePreview(currentImage || null);
        await Swal.fire('Upload Failed', 'Failed to upload image', 'error');
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
        Swal.fire('Invalid File', 'Only MP4 and MOV videos are allowed', 'error');
        return;
      }

      if (file.size > MAX_VIDEO_SIZE) {
        Swal.fire('File Too Large', 'Maximum video size is 100MB', 'error');
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
        formData.append('video_link', file);

        const response = await api_url.post<{ url: string }>('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setVideoUploadProgress(percentCompleted)
          },
        });

        setValue('video_link', response.data.url, { shouldValidate: true });
        await Swal.fire('Success!', 'Video uploaded successfully', 'success');
      } catch (error: any) {
        const err = error as AxiosError;
        console.error('Video upload failed:', err);
        setVideoPreview(currentVideo || null);
        await Swal.fire('Upload Failed',  'Failed to upload video', 'error');
      } finally {
        setIsUploadingVideo(false);
      }
    },
    [currentVideo, setValue]
  );

  const onSubmitHandler = async (data: IWork) => {
    try {
        onSubmit(data)
        // reset()
        // onCancel?.()
    } catch (error) {
      const err = error as Error;
      console.error('Submission error:', err);
      await Swal.fire('Error!', err.message || 'Failed to submit form', 'error');
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue('thumbnail', '', { shouldValidate: true });
  };

  const handleRemoveVideo = () => {
    setVideoPreview(null);
    setValue('video_link', '', { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6 grid grid-cols-1 lg:grid-cols-2 max-w-7xl gap-7 mx-auto p-5 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 col-span-1 lg:col-span-2">
      <h1 className='lg:col-span-3 text-white font-bold text-2xl'>Create Work</h1>
        {/* Name */}
        <div >
          <label className="block text-sm font-medium text-gray-100 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
            })}
            type="text"
            placeholder="John Doe"
            className={`w-full rounded-md p-2 border ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-100 mb-1">
          Description <span className="text-red-500">*</span>
          </label>
          <input
            {...register('description', {
              required: 'Description is required',
              minLength: { value: 2, message: 'Designation must be at least 2 characters' },
            })}
            type="text"
            placeholder="CEO, Company Inc."
            className={`w-full rounded-md p-2 border ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-100  mb-1">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            {...register('type', { required: 'Type is required' })}
            className={`w-full rounded-md p-2 border bg-[#101828] ${
              errors.type ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="main">Main Testimonial</option>
            <option value="shorts">Shorts</option>
            <option value="talking">Talking Head</option>
            <option value="podcast">Podcast</option>
            <option value="graphic">Graphic</option>
            <option value="advertising">Advertising</option>
            <option value="website">Website</option>
          </select>
          {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>}
        </div>
      </div>

      {/* Image Upload */}
      <div>
      <h2 className='text-white font-[600] text-lg'>Image upload progress: {imageuploadProgress}%</h2>
        <label className="block mt-1 text-sm font-medium text-gray-100 mb-1">
          Thumbnail  <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-4 mt-2">
          <label
            htmlFor="image-upload"
            className={`cursor-pointer flex-1 ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400">
              {imagePreview ? (
                <div className="relative group">
                  <img src={imagePreview} alt="Preview" className="h-32 w-full object-cover rounded-md" />
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
                  <p className="text-sm text-gray-600 mt-2">Click to upload image</p>
                  <p className="text-xs text-gray-500">JPG, PNG, WEBP up to 5MB</p>
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
        <div className='mt-5'>
          <label className="block text-sm font-medium text-gray-100 mb-1">
            Thumbnail URL :   
          </label>
          <input
            {...register('thumbnail')}
            type="text"
            placeholder="CEO, Company Inc."
            className={`w-full rounded-md p-2 border ${
              errors.thumbnail ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.thumbnail && <p className="text-sm text-red-600 mt-1">{errors.thumbnail.message}</p>}
        </div>
      </div>

      {/* Video Upload */}
      <div>
       <h2 className='text-white font-[600] text-lg'>Video upload progress: {videouploadProgress}%</h2>
        <label className="block text-sm font-medium text-gray-100  mt-2 mb-4">
          Upload Video : 
        </label>
        <div className="flex items-center gap-4">
          <label
            htmlFor="video-upload"
            className={`cursor-pointer flex-1 ${isUploadingVideo ? 'opacity-50 pointer-events-none' : ''}`}
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
                  <p className="text-sm text-gray-600 mt-2">Click to upload video</p>
                  <p className="text-xs text-gray-500">MP4, MOV up to 100MB</p>
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
      <div>
        <label className="block text-sm font-medium text-gray-100 mb-3 mt-4">
       Video Url  (url)
        </label>
        <input
          {...register('video_link')}
          placeholder="Enter testimonial message (optional)"
      
          className="w-full rounded-md p-2 border border-gray-300"
        />
      </div>
      </div>
      {/* Submit/Cancel */}
      <div className="flex justify-end gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || isUploadingImage || isUploadingVideo}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};


export default Workform;