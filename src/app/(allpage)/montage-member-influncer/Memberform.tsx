// External Libraries
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import Image from "next/image";
import { FiTrash2, FiUpload } from "react-icons/fi";

// Internal Imports
import { api_url } from "@/hook/Apiurl";
import { MemberProfile } from "@/interface/interface";

interface MemberProfileFormProps {
  onSubmit: (data: MemberProfile) => void;
  defaultValues?: Partial<MemberProfile>;
  
}

export function MemberProfileForm({ onSubmit, defaultValues }: MemberProfileFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setValue,
  } = useForm<MemberProfile>({ defaultValues });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const role = watch("role");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      Swal.fire("Invalid File", "Only JPG, PNG, and WEBP images are allowed", "error");
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

      const response = await api_url.post<{ url: string }>("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setImageUploadProgress(percentCompleted);
        },
      });

      setValue("photourl", response.data.url, { shouldDirty: true });
      await Swal.fire("Success!", "Image uploaded successfully", "success");
    } catch (error) {
      await Swal.fire("Upload Failed", "Failed to upload image", "error");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setValue("photourl", "", { shouldDirty: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 w-full max-w-4xl mx-auto rounded-lg shadow-md bg-gray-800 h-[500px] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-white">
        {defaultValues?.id ? "Edit Member Profile" : "Add New Member Profile"}
      </h2>

      <div className="space-y-6">
        {/* Personal Information Section */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-white border-b border-gray-600 pb-2">
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white ${
                  errors.name ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Role *</label>
              <select
                {...register("role", { required: "Role is required" })}
                className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white ${
                  errors.role ? "border-red-500" : "border-gray-600"
                }`}
              >
                <option value="" disabled className="text-gray-400">
                  Select a role
                </option>
                <option value="team_member" className="text-white">
                  Team Member
                </option>
                <option value="influencer" className="text-white">
                  Influencer
                </option>
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-400">{errors.role.message}</p>}
            </div>

            {/* Designation (conditional) */}
            {role === "team_member" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Designation</label>
                <input
                  type="text"
                  {...register("designation")}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                  placeholder="e.g., Software Engineer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-white border-b border-gray-600 pb-2">
            Contact Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                {...register("email")}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
              <input
                type="tel"
                {...register("phone")}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-white border-b border-gray-600 pb-2">
            Biography
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">About</label>
            <textarea
              {...register("bio")}
              rows={4}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-white border-b border-gray-600 pb-2">
            Profile Image
          </h3>
          
          {isUploadingImage && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>Uploading...</span>
                <span>{imageUploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2.5">
                <div
                  className="bg-[#1FB5DD] h-2.5 rounded-full"
                  style={{ width: `${imageUploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <Controller
            name="photourl"
            control={control}
            rules={{ required: "Profile image is required" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  {field?.value ? (
                    <div className="relative w-64 h-64 rounded-md overflow-hidden border-2 border-gray-600">
                      <Image
                        src={field.value}
                        alt="Profile Preview"
                        width={256}
                        height={256}
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition"
                        title="Remove image"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-64 h-64 flex items-center justify-center bg-gray-800 rounded-md border-2 border-dashed border-gray-600">
                      <span className="text-gray-400">No image selected</span>
                    </div>
                  )}

                  <div className="flex-1">
                    <label
                      htmlFor="image-upload"
                      className={`block ${isUploadingImage ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-md hover:border-[#1FB5DD] transition cursor-pointer bg-gray-800">
                        <div className="bg-gray-700 p-3 rounded-full mb-3">
                          <FiUpload size={24} className="text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-300 text-center">
                          <span className="font-medium text-[#1FB5DD]">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
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
                </div>

                {/* Photo URL Field (hidden when not needed) */}
                {field?.value && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Image URL *
                    </label>
                    <input
                      type="text"
                      {...register("photourl", { required: "Image URL is required" })}
                      className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white ${
                        errors.photourl ? "border-red-500" : "border-gray-600"
                      }`}
                      readOnly
                    />
                    {errors.photourl && (
                      <p className="mt-1 text-sm text-red-400">{errors.photourl.message}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#1FB5DD] text-white rounded-md hover:bg-[#1FB5DD]/90 transition font-medium"
          >
            {defaultValues?.id ? "Update Profile" : "Create Profile"}
          </button>
        </div>
      </div>
    </form>
  );
}