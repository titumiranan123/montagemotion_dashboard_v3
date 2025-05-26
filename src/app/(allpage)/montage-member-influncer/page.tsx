"use client";
import React, { useState } from "react";
import { MemberProfileCard } from "./MemberProfileCard";
import { MemberProfile } from "@/interface/interface";
import useMembers from "@/hook/useMember";
import { MemberProfileForm } from "./Memberform";
import { api_url } from "@/hook/Apiurl";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa";
import ProfileCardSkeleton from "./ProfileSkeleton";

const Member = () => {
  const [filter, setFilter] = useState<"team" | "team" | "influencer">("team");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { data, isLoading, refetch } = useMembers();
  // Filter members
  const filteredMembers =
    data?.length > 0 &&
    data?.filter((member: Partial<MemberProfile>) => {
      return member.role === (filter === "team" ? "Team Member" : "Influencer");
    });

  // Handle create new member
  const handleCreateNew = () => {
    setIsCreating(true);
    setIsFormOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (formData: MemberProfile) => {
    try {
      const method = isCreating
        ? api_url.post("/api/members", formData)
        : api_url.put("/api/members", formData);
      const res = await method;
      refetch();
      Swal.fire({
        title: res.data.message,
        icon: "success",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });

      setIsFormOpen(false);
    } catch (err:any) {

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



  if (isLoading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Our Team & Influencers</h1>

          <div className="flex gap-2.5">
            {/* Filter controls */}
            <div className="flex justify-center mb-8 gap-4   bg-[#1FB5DD] text-white px-4 py-2 rounded-md">
              <select className="bg-[#1FB5DD] text-white outline-none focus:outline-none h-8 py-1" onClick={(e: any) => setFilter(e.target.value)}>
                <option value={"team_member"}> Team Members</option>
                <option value={"influencer"}> Influencers</option>
              </select>
            </div>
            <button
              onClick={handleCreateNew}
              className="px-4 py-1 h-12 bg-[#1FB5DD] text-white rounded-md flex items-center gap-4"
            >
              Add New Member <FaPlus />
            </button>
          </div>
        </div>

        {/* Members grid */}
        <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
        {
            isLoading ? [...Array(4)].map((_,idx)=> <ProfileCardSkeleton key={idx} />) : 
          filteredMembers?.map((member: Partial<MemberProfile>) => (
            <MemberProfileCard key={member.id} profile={member} />
          ))}
        </div>

        {/* Empty state */}
        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-300">No members found</p>
          </div>
        )}

        {/* Form modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center text-white justify-center p-4 z-50 w-full">
            <div className="bg-black rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {isCreating ? "Create New Member" : "Edit Member"}
                </h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-300 hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <MemberProfileForm
                onSubmit={handleSubmit}
                defaultValues={undefined}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Member;
