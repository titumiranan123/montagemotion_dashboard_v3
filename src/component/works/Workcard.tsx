'use client'
import React from 'react'
import ReactPlayer from 'react-player'
import { FiEdit2, FiTrash2, FiEye, FiEyeOff, FiStar, FiMove } from 'react-icons/fi'
import Swal from 'sweetalert2'
import { api_url } from '@/hook/Apiurl'
import useWorks from '@/hook/useWorks'

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

interface VideoCardProps {
  video: IVideo;
  onEdit: (video: IVideo) => void;
  onToggleVisibility?: (id: string, isVisible: boolean) => void;
  onToggleFeature?: (id: string, isFeature: boolean) => void;
}

const VideoCard = ({ 
  video, 
  onEdit, 
  onToggleVisibility,
  onToggleFeature
}: VideoCardProps) => {
   const {refetch } = useWorks();
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Deleting...',
          text: 'Please wait while we delete the video',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        await api_url.delete(`/api/works/${id}`);
        refetch()
        Swal.fire({
          title: 'Deleted!',
          text: 'Your video has been deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error deleting video:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete the video',
          icon: 'error'
        });
      }
    }
  };

  return (
    <div className="flex bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 w-[500px] z-10">
      {/* Drag Handle */}
      <div className="flex items-center justify-center px-3 bg-gray-50 cursor-move hover:bg-gray-100 border-r border-gray-200 w-10">
        <FiMove className="text-gray-400" size={20} />
      </div>

      {/* Video Player Section - Fixed aspect ratio (16:9) */}
      <div className="relative w-64 h-36 flex-shrink-0 bg-black">
        <ReactPlayer
          url={video.video_link}
          playing={false}
          light={video.thumbnail}
          playIcon={
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full p-2">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          }
          width="100%"
          height="100%"
          controls={true}
          style={{ position: 'absolute', top: 0, left: 0 }}
          config={{
            youtube: {
              playerVars: {
                modestbranding: 1,
                showinfo: 0,
                rel: 0
              }
            }
          }}
        />
        
        {/* Type Badge */}
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md text-xs font-medium">
          {video.type.charAt(0).toUpperCase() + video.type.slice(1)}
        </div>
      </div>

      {/* Video Info Section */}
      <div className="flex-1 p-4 flex flex-col min-w-0"> {/* min-w-0 prevents flex overflow */}
        <div className="flex justify-between items-start mb-2 gap-2">
          <div className="min-w-0"> {/* Prevent text overflow */}
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {video.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {video.description}
            </p>
          </div>
          
          {/* Status Badges */}
          <div className="flex gap-2 flex-shrink-0">
            {onToggleVisibility && (
              <button 
                onClick={() => onToggleVisibility(video.id!, !video.is_visible)}
                className={`p-2 rounded-full ${video.is_visible ? 'text-[#1FB5DD] bg-green-50' : 'text-gray-500 bg-gray-50'}`}
                aria-label={video.is_visible ? 'Visible' : 'Hidden'}
              >
                {video.is_visible ? <FiEye size={16} /> : <FiEyeOff size={16} />}
              </button>
            )}
            
            {onToggleFeature && (
              <button 
                onClick={() => onToggleFeature(video.id!, !video.is_feature)}
                className={`p-2 rounded-full ${video.is_feature ? 'text-yellow-600 bg-yellow-50' : 'text-gray-500 bg-gray-50'}`}
                aria-label={video.is_feature ? 'Featured' : 'Not featured'}
              >
                <FiStar size={16} />
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-auto flex justify-between items-center">
          <span className="text-xs rounded-full border border-red-500 p-1 w-7 h-7 flex justify-center in-checked: text-gray-500">
             {video.position || 'Not set'}
          </span>
          
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(video)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-[#1FB5DD] rounded hover:bg-[#1FB5DD]/20 transition-colors"
            >
              <FiEdit2 size={16} />
              Edit
            </button>
            
            <button
              onClick={() => handleDelete(video.id!)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
            >
              <FiTrash2 size={16} />
              
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCard