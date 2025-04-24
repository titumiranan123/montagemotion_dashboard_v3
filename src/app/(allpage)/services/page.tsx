"use client";
import React, { useEffect, useState } from "react";
import { api_url } from "@/hook/Apiurl";
import useService from "@/hook/useService";
import Servicecard from "@/component/service/ServiceCard";
import CampaignCardSkeleton from "@/component/service/ServiceSkeleton";
import Swal from "sweetalert2";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { IService } from "@/interface/interface";
import ServiceForm from "@/component/service/Serviceform";




const ServiceManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isHaschange, setHasChanges] = useState<boolean>(false);
  const [currentService, setCurrentService] = useState<IService | null>(null);
  const { data: services, isLoading,refetch } = useService();
  const [parent, tapes, setTapes] = useDragAndDrop<HTMLDivElement, IService>(
    services || []
  );
  useEffect(() => {
    if (!isLoading && services) {
      setTapes(services);
    }
  }, [services]);
   useEffect(() => {
      setHasChanges(true);
    }, [tapes]);
  
 const handleSubmit = async (data: any) => {
     try {
       const res = await api_url.post(`/api/service${data.id ? `/${data.id}` : ""}`, data);
       Swal.fire({
         title: res.data.message,
         icon: "success",
         background: '#1f2937',
         color: '#fff',
         confirmButtonColor: '#6366f1'
       });
       refetch()
       setIsModalOpen(false);
       setCurrentService(null);
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
      await api_url.put("/api/service", payload);
      refetch()
      Swal.fire({
        title: "Positions updated!",
        icon: "success",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
      // setHasChanges(false);
    } catch (err: any) {
      Swal.fire({
        title: "Failed to update!",
        text: err.message,
        icon: "error",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
    }
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
            onClick={()=>{
              setIsModalOpen(true)
              setCurrentService(null)
            }}
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
           {/* Save Button */}
           {isHaschange && (
              <button
                onClick={savePositions}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Save Positions
              </button>
            )}
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
            <div ref={parent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {tapes?.map((service: IService) => (
                <Servicecard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
        {isModalOpen && (
         <div className="fixed inset-0  bg-black bg-opacity-80 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-scroll"> <ServiceForm initialData={currentService} onCancel={()=>setIsModalOpen(false)} onSubmit={handleSubmit} /> </div>
        )}
        
      </div>
    </div>
  );
};

export default ServiceManagement;
