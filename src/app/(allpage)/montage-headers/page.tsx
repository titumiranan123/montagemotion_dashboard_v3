"use client";
import React, { useState } from "react";
import ReactPlayer from "react-player";

import Image from "next/image";
import useIntro from "@/hook/useIntro";
import { IHeader } from "@/interface/interface";
import Headersskeleton from "@/component/headers/Headersskeleton";
import HeaderForm from "@/component/headers/Headerform";
import Swal from "sweetalert2";
import { api_url } from "@/hook/Apiurl";

const Header = () => {
  const { data, isLoading ,refetch} = useIntro();
  const [isHeader, setHeaderModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("main");
  const [editData, setEditData] = useState<IHeader>({
    title: "",
    description: "",
    thumbnail: "",
    video_link: "",
    type: "main",
  });

  const filteredData = data?.filter((item: IHeader) => item?.type === activeFilter);
  const handleSubmit = async (data: any) => {
    try {
      const res = await api_url.post(`/api/header`, data);
      refetch()
      Swal.fire({
        title: res.data.message,
        icon: "success",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
      setHeaderModal(false);
      setEditData({
        title: "",
        description: "",
        thumbnail: "",
        video_link: "",
        type: "main",
      });
    } catch (err: any) {
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
    <section className="min-h-screen relative   text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold ">
          Header 
            </h1>
            <p className="text-gray-400">Manage Main and Landing Page Headers</p>
          </div>
          <div className="flex mt-5 flex-col sm:flex-row gap-5 md:gap-3 w-full md:w-auto">
            {/* Filter */}
            <select
              onClick={(e: any) => setActiveFilter(e.target.value)}
              className="flex gap-2 overflow-x-auto pb-2 bg-[#101828] md:w-[200px] w-full border  border-slate-300 rounded-lg p-1"
            >
              {[
                "main",
                "shorts",
                "talking",
                "podcast",
                "graphic",
                "advertising",
                "website",
              ]?.map((type) => (
                <option
                  key={type}
                  value={type}
                  className={`px-3 py-1 hover:bg-[#1FB5DD] rounded-full text-sm whitespace-nowrap transition-colors ${
                    activeFilter === type
                      ? "bg-[#1FB5DD] text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            {/* Add Button */}
            <button
              onClick={() => {
                setEditData({
                  title: "",
                  description: "",
                  thumbnail: "",
                  video_link: "",
                  type: "main",
                });
                setHeaderModal(true);
              }}
              className="bg-[#1FB5DD] hover:bg-[#1FB5DD] text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
            >
              + Add Header
            </button>
          </div>
        </div>
        {isLoading ? (
          <Headersskeleton />
        ) : (
          <>
            {" "}
            {filteredData?.length > 0 ? (
              filteredData?.map((header: IHeader, idx: number) => (
                <div
                  key={idx}
                  className="relative w-full lg:min-h-screen  overflow-hidden"
                  style={{
                    backgroundImage: "url(/assets/logobackgourd.png)",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "50% 10px",
                    backgroundSize: "contain",
                  }}
                >
                  <div className="max-w-[800px] mx-auto lg:mt-[120px] mt-16">
                    <h1 className=" poppins uppercase z-20 text-[21px] md:text-[45px] lg:text-[64px] font-bold md:leading-[72px] text-center">
                      {header.title}
                    </h1>

                    <p className=" text-[#E4E8F7] text-[12px] md:text-[16px] font-[400] mt-[23px] text-center md:text-left">
                      {header.description}
                    </p>
                  </div>

                  <div className="mx-auto  mt-[100px] rounded-xl overflow-hidden lg:w-[794px] lg:h-[447px] md:h-[400px] h-[210px] w-full">
                    {header.thumbnail && (
                      <div className="relative w-full h-full bg-black aspect-video">
                        <ReactPlayer
                          url={header.video_link}
                          playing={false}
                          light={header.thumbnail}
                          playIcon={
                            <Image
                              src="/assets/playbutton.png"
                              width={80}
                              height={80}
                              alt="Play"
                              className="z-10"
                            />
                          }
                          width="100%"
                          height="100%"
                          controls
                          config={{
                            youtube: {
                              playerVars: {
                                modestbranding: 1,
                                showinfo: 0,
                                rel: 0,
                                controls: 0,
                                fs: 0,
                              },
                            },
                          }}
                          className="absolute top-0 left-0"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setEditData(header);
                      setHeaderModal(true);
                    }}
                    className="bg-[#1FB5DD] hover:bg-[#1FB5DD] text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap justify-end mt-10 md:mt-5"
                  >
                    Edit Header
                  </button>
                </div>
              ))
            ) : (
              <div className="flex justify-center in-checked: gap-10 p-10 text-white">
                No Videos
              </div>
            )}
          </>
        )}
      </div>
      {isHeader && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto w-full">
          <div className="w-full max-w-7xl my-8 relative">
            <button
              onClick={() => setHeaderModal(false)}
              className="absolute top-8 right-0 m-4 text-3xl text-white hover:text-gray-300"
            >
              ×
            </button>
            <HeaderForm
              defaultValues={editData}
              isSubmitting={false}
              onSubmit={handleSubmit}
              onCancel={() => setHeaderModal(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Header;
