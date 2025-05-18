import { api_url } from "@/hook/Apiurl";
import { MemberProfile } from "@/interface/interface";
import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiTrash2, FiUpload } from "react-icons/fi";
import Swal from "sweetalert2";
import CreatableSelect from "react-select/creatable";
export function MemberProfileForm({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (data: MemberProfile) => void;
  defaultValues?: Partial<MemberProfile>;
}) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setValue,
  } = useForm<MemberProfile>({
    defaultValues: {
      sociallinks: {},
      ...defaultValues,
    },
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const role = watch("role");
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

      setValue("photourl", response.data.url, { shouldDirty: true });
      await Swal.fire("Success!", "Image uploaded successfully", "success");
    } catch (error) {
      await Swal.fire("Upload Failed", "Failed to upload image", "error");
    } finally {
      setIsUploadingImage(false);
    }
  };
  const handleTagsChange = (newValue: any) => {
    const keywords = newValue ? newValue.map((item: any) => item.value) : [];
    setValue("skills", keywords);
  };
  const handleRemoveImage = () => {
    setValue("photourl", "", { shouldDirty: true });
  };

  // Handle array fields (platforms, collaborationType, skills, portfolioLinks)
  const handleArrayInput = (field: keyof MemberProfile, value: string) => {
    const currentValue = watch(field) || [];
    const newValue =
      Array.isArray(currentValue) && currentValue.includes(value)
        ? currentValue.filter((item: string) => item !== value)
        : [...(Array.isArray(currentValue) ? currentValue : []), value];
    setValue(field, newValue as any);
  };

  // Handle textarea array input (portfolioLinks)
  const handleTextareaArray = (
    field: keyof MemberProfile,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const values = e.target.value.split("\n").filter((item) => item.trim());
    setValue(field, values as any);
  };



  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto p-6  rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-300">Member Profile</h2>

      {/* Basic Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-300 border-b pb-2">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Name *
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Role *
            </label>
            <select
              {...register("role", { required: "Role is required" })}
              className={`w-full bg-black px-3 py-2 border rounded-md ${
                errors.role ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select a role</option>
              <option value="team_member">Team Member</option>
              <option value="influencer">Influencer</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {/* Role-specific fields */}
          {role === "Team Member" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Designation
              </label>
              <input
                type="text"
                {...register("designation")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          )}

          {role === "Influencer" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                {...register("username")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          )}

          {/* Image Upload */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-200 mb-5">
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
              name="photourl"
              control={control}
              rules={{ required: "Image is required" }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {field?.value && (
                      <div className="relative lg:w-[263px] lg:h-[291px] rounded-md overflow-hidden border">
                        <Image
                          src={field?.value}
                          alt="Blog featured image"
                          width={263}
                          height={291}
                          layout="responsive"
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
                        isUploadingImage ? "opacity-50 pointer-events-none" : ""
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
                    <p className="mt-1 text-sm text-red-600">{error.message}</p>
                  )}
                </div>
              )}
            />
              {/* url */}
          <div className="mb-5 mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Photo url *
            </label>
            <input
              type="text"
              {...register("photourl", { required: "photoUrl is required" })}
              className={`w-full px-3 py-2 border rounded-md ${errors.photourl ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.photourl && (
              <p className="mt-1 text-sm text-red-600">{errors.photourl.message}</p>
            )}
          </div>
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Bio
            </label>
            <textarea
              {...register("bio")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              {...register("location")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                {...register("phone")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Role-specific sections */}
      {role === "Influencer" && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-300 border-b pb-2">
            Influencer Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Niche */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Niche
              </label>
              <input
                type="text"
                {...register("niche")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Followers */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Followers
              </label>
              <input
                type="number"
                {...register("followers", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Platforms */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Platforms
              </label>
              <div className="flex flex-wrap gap-4">
                {["Instagram", "YouTube", "TikTok", "Twitter", "Facebook"].map(
                  (platform) => (
                    <label key={platform} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          watch("platforms")?.includes(platform) || false
                        }
                        onChange={() => handleArrayInput("platforms", platform)}
                        className="h-4 w-4 text-[#1FB5DD] border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-300">{platform}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Collaboration Types */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Collaboration Types
              </label>
              <div className="flex flex-wrap gap-4">
                {[
                  "Paid Promotion",
                  "Affiliate Marketing",
                  "Product Review",
                  "Brand Ambassador",
                  "Sponsored Content",
                ].map((type) => (
                  <label key={type} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        watch("collaborationtype")?.includes(type) || false
                      }
                      onChange={() =>
                        handleArrayInput("collaborationtype", type)
                      }
                      className="h-4 w-4 text-[#1FB5DD] border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-300">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Engagement Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Engagement Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                {...register("engagementrate", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Portfolio Links */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Portfolio Links (one per line)
              </label>
              <textarea
                value={watch("portfoliolinks")?.join("\n") || ""}
                onChange={(e) => handleTextareaArray("portfoliolinks", e)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://example.com/portfolio"
              />
            </div>
          </div>
        </div>
      )}

      {role === "Team Member" && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-300 border-b pb-2">
            Team Member Details
          </h3>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Skills (comma separated)
            </label>
              {/* SEO Keywords */}
        <label className="block">
          <span className="text-sm font-medium text-black mb-1">SEO Keywords:</span>
          <Controller
            name="skills"
            control={control}
            render={({ field }) => {
      
              // Convert string array to React Select format
              const selectValue = Array.isArray(field?.value)
              ? field.value.map((keyword: string) => ({ value: keyword, label: keyword }))
              : typeof field?.value === 'string'
                ? (JSON.parse(field.value) as string[]).map((keyword) => ({ value: keyword, label: keyword }))
                : [];

              return (
                <CreatableSelect
                  isMulti
                  onChange={handleTagsChange}
                  value={selectValue}
                  options={[]}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Type and press enter to add tags..."
                  noOptionsMessage={() => "Type to create tags"}
                  formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              );
            }}
          />
        </label>
          </div>
        </div>
      )}

      {/* Social Links */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-300 border-b pb-2">
          Social Links
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(
            [
              { platform: "instagram", label: "Instagram" },
              { platform: "facebook", label: "Facebook" },
              { platform: "linkedin", label: "LinkedIn" },
              { platform: "twitter", label: "Twitter" },
              { platform: "tiktok", label: "TikTok" },
              { platform: "youtube", label: "YouTube" },
            ] as const
          ).map(({ platform, label }) => {
            // Create the full path with proper typing
            const fieldName = `sociallinks.${platform}` as const;

            return (
              <div key={platform}>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {label} URL
                </label>
                <input
                  type="url"
                  {...register(fieldName)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder={`https://${platform}.com/username`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-[#1FB5DD] text-white rounded-md    focus:outline-none focus:ring-2 focus:ring-[#1FB5DD] focus:ring-offset-2"
        >
          Save Profile
        </button>
      </div>
    </form>
  );
}
