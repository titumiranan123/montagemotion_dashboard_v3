"use client";

import Shortcard from "@/component/testimonials/Shortcard";
import TestimonialForm from "@/component/testimonials/TestimonialForm";
import { api_url } from "@/hook/Apiurl";
import useTestimonial from "@/hook/useTestimonial";
import React, { useState } from "react";
import Swal from "sweetalert2";
import TestimonialMessagecard from "./TestimonialMessagecard";
interface testimonial {
  id?: string;
  name: string;
  designation: string;
  image: string;
  video_message?: string;
  message?: string;
  position?: number;
  category: "message" | "video_message";
  type:
    | "main"
    | "shorts"
    | "talking"
    | "podcast"
    | "graphic"
    | "advertising"
    | "website";
}
const Testimonial = () => {
  const [isTestimonial, setTestimonial] = useState(false);
  const [editData, setEditData] = useState<testimonial | null>(null);
  const [activeFilter, setActiveFilter] = useState({
    type: "main",
    category: "message",
  });
  const { data, isLoading, refetch } = useTestimonial();
  const handleSubmit = async (data: any) => {
    console.log(data)
    try {
      let res;
      if (data.id) {
        res = await api_url.put(`/api/testimonials/${data.id}`, data);
      } else {
        res = await api_url.post("/api/testimonials", data);
      }
      console.log(res)
      // refetch();
      Swal.fire({
        title: res.data.message,
        icon: "success",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
      // setTestimonial(false);
      // setEditData(null);
    } catch (err: any) {
   
      Swal.fire({
        title: "Something went wrong!",
        text: err.responsce.data.errorMessage[0].message,
        icon: "error",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
    }
  };
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Deleting...",
          text: "Please wait while we delete the video",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await api_url.delete(`/api/testimonials/${id}`);
        refetch();
        Swal.fire({
          title: "Deleted!",
          text: "Your Testimonial has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error deleting video:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to Testimonial the video",
          icon: "error",
        });
      }
    }
  };
  // Filter testimonials by type
  const filteredData = data?.filter(
    (item: any) =>
      item.type === activeFilter.type && item.category === activeFilter.category
  );

  return (
    <div className="min-h-screen  text-gray-100 p-4 md:p-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold ">
              Testimonial Gallery
            </h1>
            <p className="text-gray-400">
              Manage and showcase client testimonials
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Filter Buttons */}
            <div className="flex gap-5 me-5 overflow-x-auto pb-2">
              <select
                className="bg-black text-white border rounded-lg px-1"
                onClick={(e: any) =>
                  setActiveFilter((prev) => ({ ...prev, type: e.target.value }))
                }
              >
                {[
                  "main",
                  "shorts",
                  "talking",
                  "podcast",
                  "graphic",
                  "advertising",
                  "website",
                ].map((type) => (
                  <option key={type} value={`${type}`}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              <select
                className="bg-black text-white border rounded-lg px-1"
                onClick={(e: any) =>
                  setActiveFilter((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              >
                {["message", "video_message"].map((type) => (
                  <option key={type} value={`${type}`}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Add New Button */}
            <button
              onClick={() => {
                setEditData(null);
                setTestimonial(true);
              }}
              className="bg-[#1FB5DD]    text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
              {[...Array(8)].map((_, idx) => (
                 <div key={idx} className="testimonialTextcard flex flex-col gap-8 animate-pulse">
                 {/* Message Skeleton */}
                 <div className="space-y-2">
                   <div className="h-4 bg-gray-200 rounded w-full"></div>
                   <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                   <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                 </div>
                 
                 {/* Author Info Skeleton */}
                 <div className="flex justify-start gap-10 items-center">
                   {/* Image Skeleton */}
                   <div className="rounded-full w-[64px] h-[64px] bg-gray-200 overflow-hidden"></div>
                   
                   <div className="space-y-2">
                     <div className="h-6 bg-gray-200 rounded w-32"></div>
                     <div className="h-4 bg-gray-200 rounded w-24"></div>
                   </div>
                 </div>
                 
                 {/* Action Buttons Skeleton */}
                 <div className="flex justify-around items-center">
                   <div className="h-10 bg-gray-200 rounded-md w-36"></div>
                   <div className="h-10 bg-gray-200 rounded-md w-36"></div>
                 </div>
               </div>
              ))}
            </div>
          ) : filteredData?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mx-auto max-w-[1000px]">
              {filteredData.map((testimonial: testimonial) =>
                testimonial.category !== "message" ? (
                  <Shortcard 
                  key={testimonial.id} 
                  data={testimonial} 
                  setEditData={setEditData}
                  setTestimonial={setTestimonial}
                  handleDelete={handleDelete}
                  />
                ) : (
                  <TestimonialMessagecard
                    key={testimonial.id}
                    testimonial={testimonial}
                    setEditData={setEditData}
                    setTestimonial={setTestimonial}
                    handleDelete={handleDelete}
                  />
                )
              )}
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
              <h3 className="text-xl font-medium text-gray-300 mb-2">
                No testimonials found
              </h3>
              <p className="text-gray-500 mb-4">
                Try changing your filters or add a new testimonial
              </p>
              <button
                onClick={() => {
                  setEditData(null);
                  setTestimonial(true);
                }}
                className="bg-[#1FB5DD]    text-white font-medium py-2 px-6 rounded-lg"
              >
                Add Testimonial
              </button>
            </div>
          )}
        </div>

        {/* Modal Form */}
        {isTestimonial && (
          <div className="fixed inset-0  backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto w-full ">
            <TestimonialForm
              onSubmit={handleSubmit}
              initialData={editData}
              onCancel={() => setTestimonial(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonial;
