'use client';
import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import { api_url } from '@/hook/Apiurl';
import ReactPlayer from "react-player";

interface ITestimonial {
  id?: string;
  name: string;
  designation: string;
  message: string;
  image: string;
  category:"message"|"video_message"
  video_message?: string;
  type: 'main' | 'shorts' | 'talking' | 'podcast' | 'graphic' | 'advertising' | 'website';
}

interface ITestimonialFormProps {
  onSubmit: (data: ITestimonial) => Promise<void> | void;
  initialData?: Partial<ITestimonial | null>;
  onCancel?: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime'];

const TestimonialForm: React.FC<ITestimonialFormProps> = ({
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
  } = useForm<ITestimonial>({
    defaultValues: {
      type: 'main',
      ...initialData,
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
  const [videoPreview, setVideoPreview] = useState<string | null>(initialData?.video_message || null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  
  const category = watch('category');
  console.log(category)
  const currentImage = watch('image');
  const currentVideo = watch('video_message');

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
        formData.append('file', file);

        const response = await api_url.post<{ url: string }>('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setImageUploadProgress(percentCompleted);
          },
        });
        setValue('image', response.data.url, { shouldValidate: true });
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
        formData.append('file', file);

        const response = await api_url.post<{ url: string }>('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setVideoUploadProgress(percentCompleted);
          },
        });

        setValue('video_message', response.data.url, { shouldValidate: true });
        await Swal.fire('Success!', 'Video uploaded successfully', 'success');
      } catch (error: any) {
        const err = error as AxiosError;
        console.error('Video upload failed:', err);
        setVideoPreview(currentVideo || null);
        await Swal.fire('Upload Failed', 'Failed to upload video', 'error');
      } finally {
        setIsUploadingVideo(false);
      }
    },
    [currentVideo, setValue]
  );

  const onSubmitHandler = async (data: ITestimonial) => {
    try {
        console.log(data);
        await onSubmit(data);
    } catch (error) {
      const err = error as Error;
      console.error('Submission error:', err);
      await Swal.fire('Error!', err.message || 'Failed to submit form', 'error');
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue('image', '', { shouldValidate: true });
  };

  const handleRemoveVideo = () => {
    setVideoPreview(null);
    setValue('video_message', '', { shouldValidate: true });
  };

  return (
    <div className=" bg-black/5  p-4 md:p-6">
      <div className="bg-gray-800  rounded-xl shadow-lg overflow-hidden w-full">
        {/* Form Header */}
        <div className=" p-6">
          <h1 className="text-2xl md:text-3xl font-bold ">
            {initialData?.id ? 'Edit Testimonial' : 'Create New Testimonial'}
          </h1>
          <p className="text-blue-100 mt-1">
            {initialData?.id ? 'Update the testimonial details' : 'Fill in the details to create a new testimonial'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmitHandler)} className="p-6 space-y-8 lg:w-[1000px] w-full">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  })}
                  type="text"
                  placeholder="John Doe"
                  className={`w-full bg-gray-700 text-white rounded-lg px-4 py-3 border ${
                    errors.name ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                  } focus:ring-2 focus:ring-blue-500 focus:outline-none transition`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                )}
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Designation <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('designation', {
                    required: 'Designation is required',
                    minLength: { value: 2, message: 'Designation must be at least 2 characters' },
                  })}
                  type="text"
                  placeholder="CEO, Company Inc."
                  className={`w-full bg-gray-700 text-white rounded-lg px-4 py-3 border ${
                    errors.designation ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                  } focus:ring-2 focus:ring-blue-500 focus:outline-none transition`}
                />
                {errors.designation && (
                  <p className="mt-1 text-sm text-red-400">{errors.designation.message}</p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('type', { required: 'Type is required' })}
                  className={`w-full bg-gray-700 text-white rounded-lg px-4 py-3 border ${
                    errors.type ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                  } focus:ring-2 focus:ring-blue-500 focus:outline-none transition`}
                >
                  <option value="main">Main Testimonial</option>
                  <option value="shorts">Shorts</option>
                  <option value="talking">Talking Head</option>
                  <option value="podcast">Podcast</option>
                  <option value="graphic">Graphic</option>
                  <option value="advertising">Advertising</option>
                  <option value="website">Website</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-400">{errors.type.message}</p>
                )}
              </div>
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className={`w-full bg-gray-700 text-white rounded-lg px-4 py-3 border ${
                    errors.type ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                  } focus:ring-2 focus:ring-blue-500 focus:outline-none transition`}
                >
                  <option value="message">Message Testimonial</option>
                  <option value="video_message">Video Testimonial</option>
            
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-400">{errors.type.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
              Media Content
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Upload */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profile Image <span className="text-red-500">*</span>
                  </label>
                  {isUploadingImage && (
                    <div className="mb-3">
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
                  <label
                    htmlFor="image-upload"
                    className={`block cursor-pointer ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-xl hover:border-blue-500 transition group">
                      {imagePreview ? (
                        <div className="relative w-full">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-48 w-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleRemoveImage();
                            }}
                            className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                            aria-label="Remove image"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="bg-gray-700 p-3 rounded-full mb-3">
                            <svg
                              className="h-10 w-10 text-gray-400"
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
                          </div>
                          <p className="text-sm text-gray-400 text-center">
                            <span className="font-medium text-blue-400 hover:text-blue-300 transition">
                              Click to upload
                            </span>{' '}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG, WEBP (Max 5MB)
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image URL (alternative)
                  </label>
                  <input
                    {...register('image')}
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Video Upload */}
            {category === 'video_message' &&  <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Video Message (Optional)
                  </label>
                  {isUploadingVideo && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Uploading...</span>
                        <span>{videoUploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-purple-600 h-2.5 rounded-full"
                          style={{ width: `${videoUploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <label
                    htmlFor="video-upload"
                    className={`block cursor-pointer ${isUploadingVideo ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-xl hover:border-purple-500 transition group">
                      {videoPreview ? (
                        <div className="relative w-full">
                          <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
                            <ReactPlayer
                              url={videoPreview}
                              width="100%"
                              height="100%"
                              controls
                            />
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleRemoveVideo();
                            }}
                            className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                            aria-label="Remove video"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="bg-gray-700 p-3 rounded-full mb-3">
                            <svg
                              className="h-10 w-10 text-gray-400"
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
                          </div>
                          <p className="text-sm text-gray-400 text-center">
                            <span className="font-medium text-purple-400 hover:text-purple-300 transition">
                              Click to upload
                            </span>{' '}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            MP4, MOV (Max 100MB)
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Video URL (alternative)
                  </label>
                  <input
                    {...register('video_message')}
                    type="text"
                    placeholder="https://example.com/video.mp4"
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                  />
                </div>
              </div>}
            </div>
          </div>

          {/* Text Message Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
              Testimonial Content
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Text Message (Optional)
              </label>
              <textarea
                {...register('message')}
                placeholder="Enter the testimonial message here..."
                rows={5}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || isUploadingImage || isUploadingVideo}
              className="px-6 py-3 bg-gradient-to-r from-[#1FB5DD] to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {initialData?.id ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                initialData?.id ? 'Update Testimonial' : 'Create Testimonial'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestimonialForm;