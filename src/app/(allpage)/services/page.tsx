"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { api_url } from "@/hook/Apiurl";
import useService from "@/hook/useService";
import Servicecard from "@/component/service/ServiceCard";
import CampaignCardSkeleton from "@/component/service/ServiceSkeleton";
import Swal from "sweetalert2";

interface Campaign {
  id: string;
  title: string;
  description: string;
  image: string;
  isPublish: boolean;
  position: number;
}

interface FormInputs {
  title: string;
  description: string;
  image: string;
  isPublish: boolean;
  position: number;
}

const CampaignManagement: React.FC = () => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const { data: campaigns, isLoading } = useService();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();
  const onSubmit: SubmitHandler<FormInputs> = async (data): Promise<void> => {
    try{
     const res =    await api_url.post("/api/service", data);
     Swal.fire(res.data.message,'',"success")
      reset();
      setIsModalOpen(false);
      setCurrentCampaign(null);
    } catch (err:any) {
        const errorMessage = err?.response?.data?.errorMessages[0]?.message || 
                      err?.response?.data?.message || 
                      err?.message || 
                      'An unknown error occurred';
  Swal.fire(errorMessage, '', 'error');
      console.error(err.response.data);
    }
  };

  const handleCreateNew = (): void => {
    reset({
      title: "",
      description: "",
      image: "",
      isPublish: false,
    });
    setCurrentCampaign(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Campaign Dashboard
            </h1>
            <p className="text-gray-400">Manage your advertising campaigns</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            New Campaign
          </button>
        </div>


        <div className="mb-8 max-w-[1000px] mx-auto">
          <h2 className="text-xl font-semibold text-white mb-4">
            Active Campaigns
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {[...Array(6)].map((_, idx) => (
                <CampaignCardSkeleton key={idx} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {campaigns?.map((service: Campaign) => (
                <Servicecard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
{
    isModalOpen && <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-gray-800 rounded-xl p-6 w-full max-w-lg border border-gray-700 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {currentCampaign ? "Edit Campaign" : "Create Campaign"}
        </h2>
        <button
          onClick={() => {
            setIsUpdateModalOpen(false);
            setCurrentCampaign(null);
          }}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            className="block text-sm font-medium text-gray-300 mb-2"
            htmlFor="title"
          >
            Title*
          </label>
          <input
            id="title"
            type="text"
            {...register("title", { required: "Title is required" })}
            className={`bg-gray-700 text-white rounded-lg w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.title ? "border-red-500" : "border-gray-700"
            }`}
            placeholder="Campaign title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-400">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-300 mb-2"
            htmlFor="description"
          >
            Description*
          </label>
          <textarea
            id="description"
            {...register("description", {
                required: "Description is required",
              })}
            rows={4}
            className={`bg-gray-700 text-white rounded-lg w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.description ? "border-red-500" : "border-gray-700"
            }`}
            placeholder="Detailed description of your campaign"
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-sm text-red-400">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-300 mb-2"
            htmlFor="image"
          >
            Image URL*
          </label>
          <input
            id="image"
            type="text"
            {...register("image", {
              required: "Image URL is required",
              pattern: {
                value: /^(https?:\/\/).+$/,
                message: "Please enter a valid URL",
              },
            })}
            className={`bg-gray-700 text-white rounded-lg w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.image ? "border-red-500" : "border-gray-700"
            }`}
            placeholder="https://example.com/image.jpg"
          />
          {errors.image && (
            <p className="mt-1 text-sm text-red-400">
              {errors.image.message}
            </p>
          )}
        </div>
       

        <div className="flex items-center">
          <input
            id="isPublish"
            type="checkbox"
            {...register("isPublish")}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
          />
          <label
            className="ml-2 block text-sm text-gray-300"
            htmlFor="isPublish"
          >
            Publish this campaign
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(false);
            }}
            className="px-5 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Create Campaign
          </button>
        </div>
      </form>
    </div>
  </div>
}
        {isUpdateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-lg border border-gray-700 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {currentCampaign ? "Edit Campaign" : "Create Campaign"}
                </h2>
                <button
                  onClick={() => {
                    setIsUpdateModalOpen(false);
                    setCurrentCampaign(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-300 mb-2"
                    htmlFor="title"
                  >
                    Title*
                  </label>
                  <input
                    id="title"
                    type="text"
                    {...register("title", { required: "Title is required" })}
                    className={`bg-gray-700 text-white rounded-lg w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.title ? "border-red-500" : "border-gray-700"
                    }`}
                    placeholder="Campaign title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-300 mb-2"
                    htmlFor="description"
                  >
                    Description*
                  </label>
                  <textarea
                    id="description"
                    {...register("description", {
                      required: "Description is required",
                    })}
                    rows={4}
                    className={`bg-gray-700 text-white rounded-lg w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.description ? "border-red-500" : "border-gray-700"
                    }`}
                    placeholder="Detailed description of your campaign"
                  ></textarea>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-300 mb-2"
                    htmlFor="image"
                  >
                    Image URL*
                  </label>
                  <input
                    id="image"
                    type="text"
                    {...register("image", {
                      required: "Image URL is required",
                      pattern: {
                        value: /^(https?:\/\/).+$/,
                        message: "Please enter a valid URL",
                      },
                    })}
                    className={`bg-gray-700 text-white rounded-lg w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.image ? "border-red-500" : "border-gray-700"
                    }`}
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.image && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.image.message}
                    </p>
                  )}
                </div>
                {currentCampaign && (
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-300 mb-2"
                      htmlFor="position"
                    >
                      Position*
                    </label>
                    <input
                      id="position"
                      type="number"
                      {...register("position", {
                        required: "Position is required",
                        min: {
                          value: 1,
                          message: "Position must be at least 1",
                        },
                      })}
                      className={`bg-gray-700 text-white rounded-lg w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.position ? "border-red-500" : "border-gray-700"
                      }`}
                      placeholder="1"
                    />
                    {errors.position && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors.position.message}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    id="isPublish"
                    type="checkbox"
                    {...register("isPublish")}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
                  />
                  <label
                    className="ml-2 block text-sm text-gray-300"
                    htmlFor="isPublish"
                  >
                    Publish this campaign
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUpdateModalOpen(false);
                      setCurrentCampaign(null);
                    }}
                    className="px-5 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {currentCampaign ? "Update Campaign" : "Create Campaign"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignManagement;
