"use client";
import { api_url } from "@/hook/Apiurl";
import { faqitem } from "@/interface/interface";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

interface accordionProp {
  index: number;
  item: faqitem;
}

const Accordion: React.FC<accordionProp> = ({ item,index }) => {
  console.log(item)
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const handleDelete =async ()=>{
    try {
        const res = await api_url.delete(`/faq/${''}`)
        
    } catch (error) {
        toast.error('Delete failed')
    }
  }

  return (
    <div
      key={index}
      className="text-white lg:w-[1000px] mx-auto bg-[#58585833] rounded-[18px] overflow-hidden"
    >
      <div
        className="cursor-pointer p-6 flex justify-between items-center"
        onClick={() => handleToggle(index)}
      >
        <h3 className="font-[600] font-montserrat leading-[30px] text-[21px] flex items-center gap-2">
          Q. {item?.question}
        </h3>
        <div className="flex-shrink-0 ml-4">
          <svg
            className={`transform fill-white transition-transform duration-300 ${
              openIndex === index ? "-rotate-180" : "rotate-0"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path d="M12,15.5a1.993,1.993,0,0,1-1.414-.585L5.293,9.621,6.707,8.207,12,13.5l5.293-5.293,1.414,1.414-5.293,5.293A1.993,1.993,0,0,1,12,15.5Z" />
          </svg>
        </div>
      </div>
      <div
        ref={(el) => {
          contentRefs.current[index] = el;
        }}
        style={{
          maxHeight:
            openIndex === index
              ? `${contentRefs.current[index]?.scrollHeight}px`
              : "0px",
        }}
        className="transition-all duration-300 ease-in-out overflow-hidden"
      >
        <div className="px-6 pb-6 pt-0">
          <p className="text-[18px] leading-[26px] font-opensans">
            {item?.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
