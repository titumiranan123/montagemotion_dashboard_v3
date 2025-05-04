import React from 'react';

const ProfileCardSkeleton = () => {
  return (
    <div className="max-w-sm mx-auto rounded-xl shadow-md overflow-hidden md:max-w-2xl border p-4 border-[#1FB5DD] animate-pulse">
      {/* Header with Photo and Basic Info */}
      <div className="md:flex">
        <div className="md:shrink-0 mb-8">
          <div className="h-48 w-full bg-gray-700 rounded md:h-full md:w-48"></div>
        </div>
        <div className="p-8 w-full">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-6"></div>

          {/* Location and Contact */}
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-700 rounded-full mr-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/3"></div>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-700 rounded-full mr-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-700 rounded-full mr-2"></div>
              <div className="h-3 bg-gray-700 rounded w-2/5"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="px-8 pb-4 space-y-2">
        <div className="h-3 bg-gray-700 rounded w-full"></div>
        <div className="h-3 bg-gray-700 rounded w-5/6"></div>
        <div className="h-3 bg-gray-700 rounded w-4/6"></div>
      </div>

      {/* Role-Specific Details */}
      <div className="px-8 pb-6">
        <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="h-3 bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
          <div className="col-span-2">
            <div className="h-3 bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="px-8 py-4">
        <div className="h-4 bg-gray-700 rounded w-1/4 mb-3"></div>
        <div className="flex space-x-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-6 w-6 bg-gray-700 rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 px-8">
        <div className="h-5 w-20 bg-gray-700 rounded"></div>
        <div className="h-5 w-20 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

export default ProfileCardSkeleton;