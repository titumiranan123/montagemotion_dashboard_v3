"use client";
import Image from "next/image";
import React from "react";
import { FaEdit, FaTrash, FaPlay } from "react-icons/fa";
import ReactPlayer from "react-player";

export interface ITestimonial {
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

const Shortcard = ({
  data,
  setEditData,
  setTestimonial,
  handleDelete,
}: {
  data: ITestimonial;
  setEditData: (testimonial: ITestimonial) => void;
  setTestimonial: (a: boolean) => void;
  handleDelete: (id: string) => void;
}) => {
  return (
    <div style={{boxShadow:"inset #0A303A 0 0 50px 6px"}} className="flex w-full max-w-3xl h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ">
      {/* Media Section (Left) */}
      <div className="relative w-2/5 min-w-[256px] h-full ">
        {data.video_message ? (
          <ReactPlayer
            url={data.video_message}
            playing={false}
            // light={data.image}
            playIcon={
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 rounded-full p-3 text-white hover:bg-black/70 transition-all">
                  <FaPlay size={20} />
                </div>
              </div>
            }
            width="100%"
            height="100%"
            controls
          />
        ) : (
          <div className="relative h-full w-full">
            <Image
              src={data.image}
              alt={data.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-black/50 rounded-full p-3 text-white">
                <FaPlay size={20} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Section (Right) */}
      <div className="flex flex-col w-3/5 p-5">
        <div className="flex-grow">
        <Image
              src={data.image}
              alt={data.name}
              width={64}
              height={64}
              className="object-cover"
            />
          <div className="mb-3 mt-4">
            <h3 className="text-xl font-bold text-gray-300">{data.name}</h3>
            <p className="text-sm text-gray-500">{data.designation}</p>
          </div>
          
          {data.message && (
            <p className="text-gray-600 line-clamp-4 text-sm">
              {data.message}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => {
              setEditData(data);
              setTestimonial(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#1FB5DD] text-white rounded-lg    transition-colors text-sm"
          >
            <FaEdit size={14} />
            Edit
          </button>
          <button
            onClick={() => handleDelete(data.id as string)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            <FaTrash size={14} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Shortcard;