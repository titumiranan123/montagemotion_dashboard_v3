'use client';
import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { api_url } from '@/hook/Apiurl';
import { IService } from '@/interface/interface';

interface IWorkFormProps {
  onSubmit: (data: IService) => Promise<void> | void;
  initialData?: Partial<IService | null>;
  onCancel?: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ServiceForm: React.FC<IWorkFormProps> = ({
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
  } = useForm<IService>({
    defaultValues: {
      ...initialData,
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageuploadProgress, setImageUploadProgress] = useState(0);
  const currentImage = watch('image');

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [currentImage, setValue]);

  const onSubmitHandler = async (data: IService) => {
    try {
      onSubmit(data);
      reset();
      onCancel?.();
    } catch (error) {
      const err = error as Error;
      await Swal.fire('Error!', err.message || 'Failed to submit form', 'error');
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue('image', '', { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6 h-[600px] overflow-y-auto p-4">
      <div className="space-y-4">
         <h2 className="text-2xl font-bold text-white mb-6 pb-4 border-b border-gray-700">
        {initialData?.id ? "Edit Service" : "Create New Service"}
      </h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-100 mb-1">Title <span className="text-red-500">*</span></label>
          <input
            {...register('title', { required: 'Title is required', minLength: { value: 2, message: 'Title too short' } })}
            type="text"
            className={`w-full rounded-md p-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-100 mb-1">Description <span className="text-red-500">*</span></label>
          <input
            {...register('description', { required: 'Description is required' })}
            type="text"
            className={`w-full rounded-md p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
        </div>

        {/* Href */}
        <div>
          <label className="block text-sm font-medium text-gray-100 mb-1">Link ( N.B. : Developer only)   <span className="text-red-500">*</span></label>
          <input
            {...register('href', { required: 'Href is required' })}
            type="text"
            placeholder="https://example.com"
            className={`w-full rounded-md p-2 border ${errors.href ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.href && <p className="text-sm text-red-600 mt-1">{errors.href.message}</p>}
        </div>

      

        {/* Is Publish */}
        <div className='flex items-center gap-2'>
          <input
            {...register('isPublish')}
            type="checkbox"
            className="w-4 h-4 border-gray-300 rounded"
          />
          <label className="text-sm text-gray-100">Is Publish</label>
        </div>

        {/* Is Active */}
        <div className='flex items-center gap-2'>
          <input
            {...register('is_active')}
            type="checkbox"
            className="w-4 h-4 border-gray-300 rounded"
          />
          <label className="text-sm text-gray-100">Is Active</label>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <h2 className='text-white font-[600] text-lg'>Image upload progress: {imageuploadProgress}%</h2>
        <label className="block mt-1 text-sm font-medium text-gray-100 mb-1">Thumbnail <span className="text-red-500">*</span></label>
        <div className="flex items-center gap-4 mt-2">
          <label htmlFor="image-upload" className={`cursor-pointer flex-1 ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
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
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
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
          <label className="block text-sm font-medium text-gray-100 mb-1">Thumbnail URL</label>
          <input
            {...register('image')}
            type="text"
            className={`w-full rounded-md p-2 border ${errors.image ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.image && <p className="text-sm text-red-600 mt-1">{errors.image.message}</p>}
        </div>
      </div>

      {/* Buttons */}
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
          disabled={isSubmitting || isUploadingImage}
          className="px-4 py-2 bg-[#1FB5DD] text-white rounded    disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;
