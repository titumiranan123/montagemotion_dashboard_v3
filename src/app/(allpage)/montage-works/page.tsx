'use client';
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import CampaignCardSkeleton from "@/component/service/ServiceSkeleton";
import VideoCard from "@/component/works/Workcard";
import { api_url } from "@/hook/Apiurl";
import useWorks from "@/hook/useWorks";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import Workform from "@/component/works/Workform";

interface IVideo {
  id?: string;
  title: string;
  description: string;
  thumbnail: string;
  video_link: string;
  is_visible: boolean;
  is_feature: boolean;
  position?: number;
  type: "main" | "shorts" | "talking" | "podcast" | "graphic" | "advertising" | "website";
}

const Works = () => {
  const [isWork, setWorkModal] = useState(false);
  const [editData, setEditData] = useState<IVideo | null>(null);
  const [activeFilter, setActiveFilter] = useState("main");
  const { data = [], isLoading,refetch } = useWorks();
  const [parent, tapes, setTapes] = useDragAndDrop<HTMLDivElement, IVideo>(data || []);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!isLoading && data) {
      setTapes(data); 
    }
  }, [data]);

  useEffect(() => {
    setHasChanges(true);
  }, [tapes]);

  const handleSubmit = async (data: any) => {
    try {
      const res = await api_url.post(`/api/works${data.id ? `/${data.id}` : ""}`, data);
      refetch()
      Swal.fire({
        title: res.data.message,
        icon: "success",
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#6366f1'
      });
      setWorkModal(false);
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

  const savePositions = async () => {
    const payload = tapes.map((item, index) => ({
      id: item.id,
      position: index + 1,
    }));

    try {
      await api_url.patch("/api/works/positions",  payload );
      Swal.fire({
        title: "Positions updated!",
        icon: "success",
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#6366f1'
      });
      refetch()
      setHasChanges(false);
    } catch (err: any) {
      Swal.fire({
        title: "Failed to update!",
        text: err.message,
        icon: "error",
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#6366f1'
      });
    }
  };

  const filteredData = tapes?.filter((item) => item.type === activeFilter);
  return (
    <div className="min-h-screen   text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold ">Works Gallery</h1>
            <p className="text-gray-400">Manage and showcase client Works</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Filter */}
            <select onClick={(e:any) => setActiveFilter(e.target.value)} className="flex gap-2 overflow-x-auto pb-2 bg-[#101828] w-[200px] border border-slate-300 rounded-lg p-1">
              {[ "main", "shorts", "talking", "podcast", "graphic", "advertising", "website"].map((type) => (
                <option
                  key={type}
                  value={type}
                  
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
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
                setEditData(null);
                setWorkModal(true);
              }}
              className="bg-[#1FB5DD]  text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
            >
              + Add Works
            </button>
            {/* Save Button */}
            {hasChanges && (
              <button
                onClick={savePositions}
                className="bg-[#1FB5DD] text-white font-medium py-2 px-4 rounded-lg"
              >
                Save Positions
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, idx) => (
                <CampaignCardSkeleton key={idx} />
              ))}
            </div>
          ) : filteredData?.length > 0 ? (
            <div ref={parent} className="grid z-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredData?.map((works) => (
                <VideoCard 
                  key={works.id} 
                  video={works}
                  onEdit={()=>{
                    setEditData(works)
                    setWorkModal(true)
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-medium text-gray-300 mb-2">No works found</h3>
              <p className="text-gray-500 mb-4">Try changing your filters or add a new work</p>
              <button
                onClick={() => {
                  setEditData(null);
                  setWorkModal(true);
                }}
                className="bg-[#1FB5DD] hover:bg-[#1FB5DD] text-white font-medium py-2 px-6 rounded-lg"
              >
                Add Work
              </button>
            </div>
          )}
        </div>

        {/* Modal */}
        {isWork && (
          <div className="fixed inset-0  bg-black/20 bg-opacity-80 backdrop-blur-lg flex items-start justify-center p-4 z-50 overflow-y-scroll">
          <Workform
            onSubmit={handleSubmit}
            initialData={editData}
            onCancel={() => setWorkModal(true)}
          />
          </div>
        )}
      </div>
    </div>
  );
};

export default Works;
