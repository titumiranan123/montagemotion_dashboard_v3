"use client";
import { useForm, Controller, useFieldArray } from "react-hook-form";

import { FaPlus, FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useEffect } from "react";
import { faqitem, IFaq } from "@/interface/interface";

const typeOptions = [
  { value: "main", label: "Main" },
  { value: "shorts", label: "Shorts" },
  { value: "talking", label: "Talking" },
  { value: "podcast", label: "Podcast" },
  { value: "graphic", label: "Graphic" },
  { value: "advertising", label: "Advertising" },
  { value: "website", label: "Website" },
];

interface FaqFormProps {
  initialData?: IFaq;
  onSubmit: (data: IFaq) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const FaqForm = ({ initialData, onSubmit, onCancel, isLoading }: FaqFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<IFaq>({
    defaultValues: initialData || {
      title: "",
      sub_title: "",
      is_visible: true,
      faqs: [],
      type: "main",
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "faqs",
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const addFaqItem = () => {
    const newItem: faqitem = {
      id: Date.now().toString(),
      faq_id: "",
      question: "",
      answer: "",
      is_visible: true,
      position: fields.length + 1,
    };
    append(newItem);
  };

  const removeFaqItem = (index: number) => {
    remove(index);
    // Update positions after removal
    fields.forEach((_, idx) => {
      setValue(`faqs.${idx}.position`, idx + 1);
    });
  };

  const moveItemUp = (index: number) => {
    if (index > 0) {
      move(index, index - 1);
      setValue(`faqs.${index - 1}.position`, index);
      setValue(`faqs.${index}.position`, index + 1);
    }
  };

  const moveItemDown = (index: number) => {
    if (index < fields.length - 1) {
      move(index, index + 1);
      setValue(`faqs.${index}.position`, index + 1);
      setValue(`faqs.${index + 1}.position`, index + 2);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-slate-900 lg:w-[800px] p-5 rounded-2xl text-white h-[550px] overflow-y-auto" >
      {/* Main FAQ Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Title*
          </label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#1FB5DD] focus:border-[#1FB5DD]"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Sub Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Sub Title
          </label>
          <input
            {...register("sub_title")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#1FB5DD] focus:border-[#1FB5DD]"
          />
        </div>

         {/* Type */}
         <div className="space-y-2">
          <label htmlFor="type" className="block text-sm font-medium text-gray-300">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            {...register("type", { required: "Type is required" })}
            className={`w-full px-4 py-2.5 rounded-lg bg-gray-800 border ${
              errors.type ? "border-red-500" : "border-gray-700"
            } text-white focus:outline-none focus:ring-2 focus:ring-[#1FB5DD] focus:border-transparent appearance-none`}
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-400">{errors.type.message}</p>
          )}
        </div>

        {/* Visibility Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_visible"
            {...register("is_visible")}
            className="h-4 w-4 text-[#1FB5DD] focus:ring-[#1FB5DD] border-gray-300 rounded"
          />
          <label
            htmlFor="is_visible"
            className="ml-2 block text-sm text-gray-300"
          >
            Visible
          </label>
        </div>
      </div>

      {/* FAQ Items Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-300">FAQ Items</h3>
          <button
            type="button"
            onClick={addFaqItem}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-[#1FB5DD]    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1FB5DD]"
          >
            <FaPlus className="mr-2" />
            Add Item
          </button>
        </div>

        {fields.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No FAQ items added yet
          </div>
        )}

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border border-gray-200 rounded-lg p-4  shadow-sm"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-300">
                  FAQ Item {index + 1}
                </h4>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => moveItemUp(index)}
                    disabled={index === 0}
                    className="text-gray-500 hover:text-[#1FB5DD] disabled:opacity-30"
                  >
                    <FaArrowUp />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItemDown(index)}
                    disabled={index === fields.length - 1}
                    className="text-gray-500 hover:text-[#1FB5DD] disabled:opacity-30"
                  >
                    <FaArrowDown />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFaqItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className=" gap-4">
                {/* Question */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Question*
                  </label>
                  <input
                    {...register(`faqs.${index}.question`, {
                      required: "Question is required",
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#1FB5DD] focus:border-[#1FB5DD]"
                  />
                  {errors.faqs?.[index]?.question && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.faqs?.[index]?.question?.message}
                    </p>
                  )}
                </div>

              </div>

              {/* Answer */}
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Answer*
                </label>
                <textarea
                  {...register(`faqs.${index}.answer`, {
                    required: "Answer is required",
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#1FB5DD] focus:border-[#1FB5DD] min-h-[100px]"
                />
                {errors.faqs?.[index]?.answer && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.faqs?.[index]?.answer?.message}
                  </p>
                )}
              </div>

              {/* Visibility */}
              <div className="mt-3 flex items-center">
                <input
                  type="checkbox"
                  id={`faqs.${index}.is_visible`}
                  {...register(`faqs.${index}.is_visible`)}
                  className="h-4 w-4 text-[#1FB5DD] focus:ring-[#1FB5DD] border-gray-300 rounded"
                />
                <label
                  htmlFor={`faqs.${index}.is_visible`}
                  className="ml-2 block text-sm text-gray-300"
                >
                  Visible
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-300  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1FB5DD]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1FB5DD]    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1FB5DD] disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save FAQ"}
        </button>
      </div>
    </form>
  );
};