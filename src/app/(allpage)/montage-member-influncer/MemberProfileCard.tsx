"use client";
import { MemberProfile } from "@/interface/interface";
import { MemberProfileForm } from "./Memberform";
import { useState } from "react";
import Swal from "sweetalert2";
import { api_url } from "@/hook/Apiurl";
import useMembers from "@/hook/useMember";
import { FaEdit, FaTrash } from "react-icons/fa";

export function MemberProfileCard({
  profile,
}: {
  profile: Partial<MemberProfile>;
}) {
  const { refetch } = useMembers();
  // Parse JSON strings for platforms, collaboration types, and social links
  const parseStringArray = (input: string | string[] | undefined): string[] => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    try {
      const parsed = JSON.parse(input);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const parseSocialLinks = (
    input: string | Record<string, string> | undefined
  ): Record<string, string> | null => {
    if (!input) return null;
    if (typeof input === "object") return input;
    try {
      const parsed = JSON.parse(input);
      return typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  };

  // Usage in your component
  const platforms = parseStringArray(profile.platforms);
  const collaborationTypes = parseStringArray(profile.collaborationtype);
  const socialLinks = parseSocialLinks(profile.sociallinks); // Note lowercase 'sociallinks'
  const portfolioLinks = parseStringArray(profile.portfoliolinks); // Note lowercase 'portfoliolinks'
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Handle form submission
  const handleSubmit = async (formData: MemberProfile) => {
    try {
      const method = await api_url.put(`/api/members/${formData.id}`, formData);
      console.log(method);

      setIsFormOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  // Handle delete member
  const handleDelete = async (id: string) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    // If user confirms deletion
    if (result.isConfirmed) {
      try {
        // Show loading indicator
        Swal.fire({
          title: "Deleting...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await api_url.delete(`/api/members/${id}`);

        // Show success message
        await Swal.fire({
          title: "Deleted!",
          text: "The member has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        refetch();
      } catch (err) {
        // Show error message
        await Swal.fire({
          title: "Error!",
          text: err instanceof Error ? err.message : "Failed to delete member",
          icon: "error",
        });
      }
    }
  };
  return (
    <div className="max-w-sm mx-auto text-white rounded-xl shadow-md overflow-hidden md:max-w-2xl border p-4 border-[#1FB5DD]">
      {/* Header with Photo and Basic Info */}
      <div className="md:flex">
        <div className="md:shrink-0 mb-8">
          <img
            className="h-48 w-full object-cover md:h-full md:w-48"
            src={profile.photourl}
            alt={`${profile.name}'s profile`}
          />
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            {profile.role}
          </div>
          <h1 className="block mt-1 text-lg leading-tight font-medium text-white">
            {profile.name}
          </h1>
          {profile.username && (
            <p className="mt-1 text-gray-300">@{profile.username}</p>
          )}

          {/* Location and Contact */}
          <div className="mt-4">
            {profile.location && (
              <div className="flex items-center text-gray-300">
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {profile.location}
              </div>
            )}
            {profile.email && (
              <div className="flex items-center mt-1 text-gray-300">
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {profile.email}
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center mt-1 text-gray-300">
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {profile.phone}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bio Section */}
      {profile.bio && (
        <div className="px-8 pb-4">
          <p className="text-gray-300">{profile.bio}</p>
        </div>
      )}

      {/* Role-Specific Details */}
      <div className="px-8 pb-6">
        {profile.role === "Influencer" && (
          <div className="mt-4">
            <h3 className="font-medium text-gray-300">Influencer Details</h3>
            <div className="mt-2 grid grid-cols-2 gap-4">
              {profile.niche && (
                <div>
                  <p className="text-sm text-gray-300">Niche</p>
                  <p className="text-sm font-medium text-gray-300">
                    {profile.niche}
                  </p>
                </div>
              )}
              {profile.followers && (
                <div>
                  <p className="text-sm text-gray-300">Followers</p>
                  <p className="text-sm font-medium text-gray-300">
                    {profile.followers.toLocaleString()}
                  </p>
                </div>
              )}
              {profile.engagementrate && (
                <div>
                  <p className="text-sm text-gray-300">Engagement Rate</p>
                  <p className="text-sm font-medium text-gray-300">
                    {profile.engagementrate}%
                  </p>
                </div>
              )}
              {platforms.length > 0 && (
                <div>
                  <p className="text-sm text-gray-300">Platforms</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {platforms.map((platform: string) => (
                      <span
                        key={platform}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {collaborationTypes.length > 0 && (
                <div>
                  <p className="text-sm text-gray-300">Collaboration Types</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {collaborationTypes.map((type: string) => (
                      <span
                        key={type}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {portfolioLinks.length > 0 && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-300">Portfolio Links</p>
                  <div className="mt-1 space-y-1">
                    {portfolioLinks.map((link: string, index: number) => (
                      <div key={index} className="truncate">
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {link}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Social Links */}
      {socialLinks && (
        <div className=" px-8 py-4">
          <h3 className="text-sm font-medium text-gray-300">Social Links</h3>
          <div className="flex space-x-6 mt-2">
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-gray-300"
              >
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="#fff" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            )}
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-gray-300"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-gray-300"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            )}
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-gray-300"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            )}
            {socialLinks.tiktok && (
              <a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-gray-300"
              >
                <span className="sr-only">TikTok</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            )}
            {socialLinks.youtube && (
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-gray-300"
              >
                <span className="sr-only">YouTube</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      )}
      <div className="flex items-center gap-4">
        <div
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 cursor-pointer text-[#1FB5DD]"
        >
          <FaEdit />
          <span>Edit</span>
        </div>

        <button
          onClick={() => profile.id && handleDelete(profile.id)}
          className=" hover:text-red-500 flex items-center gap-2"
        >
          <FaTrash /> <span> Delete</span>
        </button>
      </div>
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center text-white justify-center p-4 z-50 w-full">
          <div className="bg-black rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Update Profile</h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-300 hover:text-gray-300"
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
