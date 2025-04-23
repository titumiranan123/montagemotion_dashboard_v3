'use client'
import React from 'react'
import ReactPlayer from 'react-player'
 interface IVideo {
    id?: string;
    title:string
    description:string;
    thumbnail: string;
    video_link: string;
    isVisible: boolean;
    isFeature:boolean
    position?: number;
    type: "main" |"shorts" | "talking" | "podcast" | "graphic" | "advertising" | "website" ; 
  }
interface VideoCardProps {
  video: IVideo
  onEdit?: () => void
}

const VideoCard = ({ video, onEdit }: VideoCardProps) => {


  return (
    <div className="flex flex-col bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      {/* Video Player Section */}
      <div 
        className="relative pt-[56.25%] bg-black" // 16:9 aspect ratio
      >
        <ReactPlayer
          url={video.video_link}
          playing={false}
          light={video.thumbnail}
          playIcon={
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full p-4">
                <svg
                  className="w-12 h-12 text-white"
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
        
        {/* Visibility Badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium ${
          video.isVisible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {video.isVisible ? 'Visible' : 'Hidden'}
        </div>
        
        {/* Type Badge */}
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md text-xs font-medium">
          {video.type.charAt(0).toUpperCase() + video.type.slice(1)}
        </div>
      </div>

      {/* Video Info Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
          {video.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {video.description}
        </p>
        
        <div className="mt-auto flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Position: {video.position || 'Not set'}
          </span>
          
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoCard