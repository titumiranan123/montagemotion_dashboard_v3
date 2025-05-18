
import Image from "next/image";
import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
interface testimonial {
  id?: string;
  name: string;
  designation: string;
  image: string;
  video_message?: string;
  message?: string;
  position?: number;
  category: "message" | "video_message";
  type:
    | "main"
    | "shorts"
    | "talking"
    | "podcast"
    | "graphic"
    | "advertising"
    | "website";
}
const TestimonialMessagecard = ({
  testimonial,
  setEditData,
  setTestimonial,
  handleDelete
}: {
  testimonial: testimonial;
  setEditData: (testimonial: testimonial) => void;
  setTestimonial: (a: boolean) => void;
  handleDelete:(id:string)=>void
}) => {
  return (
    <div className="testimonialTextcard flex flex-col gap-8">
      <p>{testimonial.message}</p>
      <div className="flex justify-start gap-10 items-center">
        <Image
          className="rounded-full w-[64px] h-[64px] overflow-hidden"
          src={testimonial.image}
          alt=""
          width={64}
          height={64}
        />
        <div>
          <h2 className="font-bold text-2xl">{testimonial.name}</h2>
          <p className="text-[16px] font-[400]">{testimonial.designation}</p>
        </div>
      </div>
    <div className="flex justify-around items-center">
    <button
    className="flex items-center gap-2 border py-2 px-3 rounded-md"
        onClick={() => {
          setEditData(testimonial);
          setTestimonial(true);
        }}
      >
        {" "}
        <FaEdit />
        <span>Edit Testimonail</span>
      </button>
      <button className="flex items-center gap-2 border py-2 px-3 rounded-md hover:text-red-500" onClick={()=>handleDelete(testimonial.id as string)}><FaTrash /> Delete</button>
    </div>
    </div>
  );
};

export default TestimonialMessagecard;
