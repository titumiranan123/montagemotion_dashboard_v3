"use client";
import { api_url } from "@/hook/Apiurl";
import Image from "next/image";
import React, { useState } from "react";
import Swal from "sweetalert2";
import ServiceForm from "./Serviceform";

interface serviceCardProps {
  service: {
    id?:string
    title: string;
    description: string;
    image: string;
    isPublish: string;
    href: string;
    position: number;
    is_active: boolean;
  };
}

const Servicecard: React.FC<serviceCardProps> = ({ service }) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

  const handleDelete = async (id: string): Promise<void> => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      reverseButtons: true,
      allowOutsideClick: false,
      backdrop: `
        rgba(0,0,0,0.7)
        url("/images/trash-icon.png")
        center top
        no-repeat
      `,
    });

    if (result.isConfirmed) {
      try {
        await api_url.delete(`/api/service/${id}`);
        await Swal.fire({
          title: "Deleted!",
          text: "Your campaign has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error(err);
        await Swal.fire({
          title: "Error!",
          text: "Failed to delete campaign. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const res = await api_url.patch(`/api/service/${data.id}`, data);
      Swal.fire({
        title: res.data.message,
        icon: "success",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
      setIsUpdateModalOpen(false);
    } catch (err: any) {
      console.log(err);
      Swal.fire({
        title: "Something went wrong!",
        text: err.message,
        icon: "error",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-row p-6 bg-[#58585833] rounded-[9.91px]">
      {/* Image Container */}
      <div className="flex-shrink-0 mr-6">
        <Image
          src={service.image}
          alt={service.title}
          priority
          width={121}
          height={121}
          className="object-cover rounded-lg"
        />
      </div>

      {/* Content Container */}
      <div className="flex flex-col justify-between flex-grow">
        {/* Header with title and position */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-montserrat font-semibold text-white">
            {service.title}
          </h3>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            #{service.position}
          </span>
        </div>

        {/* Description */}
        <p className="text-white text-base mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Action Buttons */}
        <div className="flex justify-between items-center border-gray-600 pt-4">
          <button
            onClick={() => setIsUpdateModalOpen(true)}
            className="text-white hover:text-blue-400 font-medium text-sm flex items-center transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>
          <button
            onClick={() => service?.id && handleDelete(service.id)}
            className="text-red-400 hover:text-red-600 font-medium text-sm flex items-center transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Update Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-scroll">
          <ServiceForm
            initialData={service}
            onCancel={() => setIsUpdateModalOpen(false)}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default Servicecard;
