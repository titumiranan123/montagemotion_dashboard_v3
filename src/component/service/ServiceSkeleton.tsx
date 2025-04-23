import React from 'react';

const CampaignCardSkeleton: React.FC = () => {
  return (
    <div className="md:w-[488px] md:h-[254px] w-full h-auto md:px-[22px] md:py-[66px] px-4 py-10 flex justify-between items-center gap-5 bg-[#58585833] rounded-[9.91px] animate-pulse">
      {/* Image Skeleton */}
      <div className="w-[121px] h-[121px] rounded-full bg-gray-400/30"></div>
      
      <div className="flex-1 space-y-3">
        {/* Title and Position Skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-7 w-3/4 bg-gray-400/30 rounded"></div>
          <div className="h-5 w-10 bg-gray-400/30 rounded-full"></div>
        </div>
        
        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-400/30 rounded"></div>
          <div className="h-3 w-5/6 bg-gray-400/30 rounded"></div>
          <div className="h-3 w-4/6 bg-gray-400/30 rounded"></div>
        </div>
        
        {/* Buttons Skeleton */}
        <div className="flex justify-between items-center border-t pt-4">
          <div className="h-8 w-20 bg-gray-400/30 rounded"></div>
          <div className="h-8 w-20 bg-gray-400/30 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCardSkeleton;