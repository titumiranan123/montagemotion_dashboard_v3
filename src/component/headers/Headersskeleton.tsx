import React from 'react';

const Headersskeleton = () => {
    return (
        <section className="section container pt-[14px]">
        <div
          className="relative w-full overflow-hidden"
          style={{
            backgroundImage: "url(/assets/logobackgourd.png)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "top",
          }}
        >
          <div className="max-w-[800px] mx-auto">
            {/* Title Skeleton */}
            <div className="h-8 md:h-16 lg:h-20 w-3/4 mx-auto bg-gray-300 rounded animate-pulse mb-4"></div>
            
            {/* Paragraph Skeleton */}
            <div className="space-y-2 mt-[23px]">
              <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 w-4/5 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
  
          {/* Video Player Skeleton */}
          <div className="mx-auto mt-[100px] rounded-xl overflow-hidden lg:w-[996px] lg:h-[561px] md:h-[400px] h-[210px] w-full bg-gray-300 animate-pulse">
            {/* Optional: Add inner elements to simulate video player structure */}
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 bg-gray-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    );
};

export default Headersskeleton;