'use client';
import CampaignCardSkeleton from "@/component/service/ServiceSkeleton";
import Shortcard from "@/component/testimonials/Shortcard";
import TestimonialForm from "@/component/testimonials/TestimonialForm";
import { api_url } from "@/hook/Apiurl";
import useTestimonial from "@/hook/useTestimonial";
import React, { useState } from "react";
import Swal from "sweetalert2";

const Testimonial = () => {
  const [isTestimonial, setTestimonial] = useState(false);
  const [editData, setEditData] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const { data, isLoading } = useTestimonial();

  const handleSubmit = async (data: any) => {
    try {
      let res;
      if (data.id) {
        res = await api_url.post(`/api/testimonials/${data.id}`, data);
      } else {
        res = await api_url.post("/api/testimonials", data);
      }
      Swal.fire({
        title: res.data.message,
        icon: "success",
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#6366f1'
      });
      setTestimonial(false);
      setEditData(null);
    } catch (err: any) {
      Swal.fire({
        title: "Something went wrong!",
        text: err.message,
        icon: "error",
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#6366f1'
      });
    }
  };

  // Filter testimonials by type
  const filteredData = activeFilter === "all" 
    ? data 
    : data?.filter((item: any) => item.type === activeFilter);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Testimonial Gallery</h1>
            <p className="text-gray-400">Manage and showcase client testimonials</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Filter Buttons */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {["all", "main", "shorts", "talking", "podcast", "graphic", "advertising", "website"].map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                    activeFilter === type
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Add New Button */}
            <button
              onClick={() => {
                setEditData(null);
                setTestimonial(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
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
              Add Testimonial
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="mb-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, idx) => (
                <CampaignCardSkeleton key={idx} />
              ))}
            </div>
          ) : filteredData?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((testimonial: any) => (
                <Shortcard 
                  key={testimonial.id} 
                  data={testimonial} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-800 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-500 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-medium text-gray-300 mb-2">No testimonials found</h3>
              <p className="text-gray-500 mb-4">Try changing your filters or add a new testimonial</p>
              <button
                onClick={() => {
                  setEditData(null);
                  setTestimonial(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg"
              >
                Add Testimonial
              </button>
            </div>
          )}
        </div>

        {/* Modal Form */}
        {isTestimonial && (
          <TestimonialForm
            onSubmit={handleSubmit}
            initialData={editData}
            onCancel={() => setTestimonial(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Testimonial;