"use client";

import React, { useState } from "react";
import Image from "next/image";
import ReactPlayer from "react-player";
import Swal from "sweetalert2";

import useIntro from "@/hook/useIntro";
import { IHeader } from "@/interface/interface";
import HeaderSkeleton from "@/component/headers/Headersskeleton";
import HeaderForm from "@/component/headers/Headerform";
import { api_url } from "@/hook/Apiurl";

const defaultHeaderData: IHeader = {
  title: "",
  description: "",
  book_link: "",
  thumbnail: "",
  alt: "",
  video_link: "",
  type: "main",
};

const Header = () => {
  const { data, isLoading, refetch } = useIntro();
  console.log(data, "header");
  const [isHeaderModalOpen, setHeaderModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("main");
  const [editData, setEditData] = useState<IHeader>(defaultHeaderData);

  const filteredData =
    data?.filter((item: IHeader) => item?.type === activeFilter) ?? [];

  const handleSubmit = async (formData: IHeader) => {
    try {
      const res = await api_url.post(`/api/header`, formData);
      await refetch();

      Swal.fire({
        title: res.data?.message ?? "Header saved successfully!",
        icon: "success",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });

      setHeaderModalOpen(false);
      setEditData(defaultHeaderData);
    } catch (err: any) {
      Swal.fire({
        title: "Something went wrong!",
        text: err?.message ?? "Unknown error",
        icon: "error",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
    }
  };

  return (
    <section className="min-h-screen text-gray-100 p-4 md:p-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header top bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Header</h1>
            <p className="text-gray-400">
              Manage Main and Landing Page Headers
            </p>
          </div>

          <div className="flex mt-5 flex-col sm:flex-row gap-5 md:gap-3 w-full md:w-auto">
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="bg-[#101828] border border-slate-300 rounded-lg p-2 text-white w-full md:w-[200px]"
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
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setEditData(defaultHeaderData);
                setHeaderModalOpen(true);
              }}
              className="bg-[#1FB5DD] hover:bg-[#1FA4C0] text-white font-medium py-2 px-4 rounded-lg transition"
            >
              + Add Header
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <HeaderSkeleton />
        ) : filteredData?.length > 0 ? (
          filteredData?.map((header: any, idx: string) => (
            <div
              key={idx}
              className="relative w-full overflow-hidden py-10"
              style={{
                backgroundImage: "url(/assets/logobackgourd.png)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "50% 10px",
                backgroundSize: "contain",
              }}
            >
              <div className="max-w-[800px] mx-auto mt-10 text-center">
                <h1 className="text-[21px] md:text-[45px] lg:text-[64px] font-bold leading-tight uppercase">
                  {header?.title ?? "No Title"}
                </h1>
                <p className="text-[#E4E8F7] text-sm md:text-base mt-4">
                  {header?.description ?? "No Description"}
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

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => {
                    setEditData(header);
                    setHeaderModalOpen(true);
                  }}
                  className="bg-[#1FB5DD] hover:bg-[#1FA4C0] text-white font-medium py-2 px-4 rounded-lg transition"
                >
                  Edit Header
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-white py-20">No Videos</div>
        )}
      </div>

      {/* Modal */}
      {isHeaderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-black border border-gray-700 rounded-lg relative my-10">
            <button
              onClick={() => setHeaderModalOpen(false)}
              className="absolute top-4 right-4 text-3xl text-white hover:text-gray-400"
            >
              &times;
            </button>
            <HeaderForm
              defaultValues={editData}
              isSubmitting={false}
              onSubmit={handleSubmit}
              onCancel={() => setHeaderModalOpen(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Header;
