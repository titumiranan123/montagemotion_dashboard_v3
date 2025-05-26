"use client";
import { api_url } from "@/hook/Apiurl";
import useFaq from "@/hook/useFaq";
import { faqitem } from "@/interface/interface";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

interface AccordionProp {
  index: number;
  item: faqitem;
}

const Accordion: React.FC<AccordionProp> = ({ item, index }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { refetch } = useFaq();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<faqitem>({
    defaultValues: {
      id: item.id,
      faq_id: item.faq_id,
      question: item.question,
      answer: item.answer,
      is_visible: item.is_visible,
      position: item.position,
    },
  });
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
  
    if (!result.isConfirmed) return;
  
    try {
      await api_url.delete(`/api/faqitem/${item.id}`);
      await refetch();
      toast.success("FAQ deleted successfully");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const onSubmit = async (data: faqitem) => {
    try {
      await api_url.patch(`/api/faqitem/${item.id}`, data);
      setIsEditModalOpen(false);
      refetch()
      reset()
      toast.success("FAQ updated successfully");
    } catch (error) {

      toast.error("Update failed");
    }
  };

  return (
    <>
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
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => handleEditClick(e)}
              className="text-white hover:text-[#1FB5DD] transition-colors"
              aria-label="Edit FAQ"
            >
              <FaEdit size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="text-white hover:text-red-300 transition-colors"
              aria-label="Delete FAQ"
            >
              <FaTrash size={18} />
            </button>
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

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#585858] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-white">Edit FAQ</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Hidden Fields */}
              <input type="hidden" {...register("id")} />
              <input type="hidden" {...register("faq_id")} />

              {/* Question Field */}
              <div className="mb-4">
                <label className="block text-white mb-2" htmlFor="question">
                  Question*
                </label>
                <input
                  id="question"
                  className="w-full p-2 rounded bg-[#333] text-white"
                  {...register("question", {
                    required: "Question is required",
                  })}
                />
                {errors.question && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.question.message}
                  </p>
                )}
              </div>

              {/* Answer Field */}
              <div className="mb-4">
                <label className="block text-white mb-2" htmlFor="answer">
                  Answer*
                </label>
                <textarea
                  id="answer"
                  className="w-full p-2 rounded bg-[#333] text-white min-h-[100px]"
                  {...register("answer", { required: "Answer is required" })}
                />
                {errors.answer && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.answer.message}
                  </p>
                )}
              </div>

              {/* Visibility Toggle */}
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="is_visible"
                  className="mr-2"
                  {...register("is_visible")}
                />
                <label className="text-white" htmlFor="is_visible">
                  Visible to users
                </label>
              </div>

             

              {/* Form Actions */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(!isEditModalOpen)}
                  className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#1FB5DD] text-white hover:bg-[#1FB5DD] disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Accordion;
