"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MemberProfile } from "@/interface/interface";
import { MemberProfileForm } from "./Memberform";
import { api_url } from "@/hook/Apiurl";
import useMembers from "@/hook/useMember";

interface MemberProfileCardProps {
  profile: Partial<MemberProfile>;
}

export function MemberProfileCard({ profile }: MemberProfileCardProps) {
  const { refetch } = useMembers();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = async (formData: MemberProfile) => {
    try {
      const response = await api_url.put(
        `/api/members/${formData.id}`,
        formData
      );
      await Swal.fire({
        title: response.data.message,
        icon: "success",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
      setIsFormOpen(false);
      refetch();
    } catch (err: any) {
      await Swal.fire({
        title: "Error!",
        text:
          err.response?.data?.errorMessage?.[0]?.message ||
          "Failed to update member",
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
      background: "#1f2937",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Deleting...",
          allowOutsideClick: false,
          background: "#1f2937",
          color: "#fff",
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await api_url.delete(`/api/members/${id}`);

        await Swal.fire({
          title: "Deleted!",
          text: "The member has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#1f2937",
          color: "#fff",
        });

        refetch();
      } catch (err) {
        await Swal.fire({
          title: "Error!",
          text: err instanceof Error ? err.message : "Failed to delete member",
          icon: "error",
          background: "#1f2937",
          color: "#fff",
        });
      }
    }
  };
  if (!profile) return null; 
  return (
    <div className="max-w-sm mx-auto text-white rounded-xl shadow-md overflow-hidden md:max-w-2xl border p-4 border-[#1FB5DD]">
      {/* Header with Photo and Basic Info */}
      <div className="md:flex">
        <div className="md:shrink-0 mb-8">
          <img
            className="h-48 w-full object-cover md:h-full md:w-48"
            src={profile.photourl}
            alt={`${profile.name}'s profile`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/default-profile.png";
            }}
          />
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-[#1FB5DD] font-semibold">
            {profile.role}
          </div>
          <h1 className="block mt-1 text-lg leading-tight font-medium text-white">
         Designation :   {profile.designation}
          </h1>
          <h1 className="block mt-1 text-lg leading-tight font-medium text-white">
          Email :  {profile.email}
          </h1>
          <h1 className="block mt-1 text-lg leading-tight font-medium text-white">
          Contact :  {profile.phone}
          </h1>
        </div>
      </div>

      {/* Bio Section */}
      {profile.bio && (
        <div className="px-8 pb-4">
          <p className="text-gray-300">{profile.bio}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 cursor-pointer text-[#1FB5DD] hover:text-[#1a9fc4]"
          aria-label="Edit member"
        >
          <FaEdit />
          <span>Edit</span>
        </button>

        <button
          onClick={() => profile.id && handleDelete(profile.id)}
          className="flex items-center gap-2 text-gray-300 hover:text-red-500"
          aria-label="Delete member"
        >
          <FaTrash />
          <span>Delete</span>
        </button>
      </div>

      {/* Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Update Profile</h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <MemberProfileForm
              onSubmit={handleSubmit}
              defaultValues={profile}
            />
          </div>
        </div>
      )}
    </div>
  );
}
