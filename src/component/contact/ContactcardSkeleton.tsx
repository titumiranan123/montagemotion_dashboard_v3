import React from "react";

const ContactcardSkeleton = () => {
  return (
    <div className="w-full border border-white rounded-xl shadow-md overflow-hidden mb-6 bg-gray-800">
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-3 w-2/3">
          <div className="h-7 bg-gray-700 rounded-full animate-pulse w-1/2"></div>
          <div className="h-5 bg-gray-700 rounded-full animate-pulse w-3/4"></div>
        </div>
        <div className="h-4 bg-gray-700 rounded-full animate-pulse w-1/4"></div>
      </div>
  
      {/* Message Box - Matches your bg-gray-50 style but for dark mode */}
      <div className="bg-gray-700 p-4 rounded-lg mb-4 space-y-3">
        <div className="h-4 bg-gray-600 rounded-full animate-pulse w-1/6 mb-3"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-600 rounded-full animate-pulse w-full"></div>
          <div className="h-3 bg-gray-600 rounded-full animate-pulse w-11/12"></div>
          <div className="h-3 bg-gray-600 rounded-full animate-pulse w-10/12"></div>
          <div className="h-3 bg-gray-600 rounded-full animate-pulse w-9/12"></div>
        </div>
      </div>
  
      {/* Footer - ID and timestamp */}
      <div className="flex justify-between items-center">
        <div className="h-3 bg-gray-700 rounded-full animate-pulse w-1/6"></div>
        <div className="h-3 bg-gray-700 rounded-full animate-pulse w-1/4"></div>
      </div>
    </div>
  </div>
  );
};

export default ContactcardSkeleton;
