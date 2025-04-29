"use client";

import Accordion from "@/component/faqs/Accordion";
import useFaq from "@/hook/useFaq";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import React, { useEffect, useState } from "react";
import { faqitem, IFaq } from "@/interface/interface";
import Link from "next/link";
import Swal from "sweetalert2";
import { api_url } from "@/hook/Apiurl";

const Faqs = () => {
  const { data: faqCategories, isLoading, refetch } = useFaq();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isHasChange, setHasChanges] = useState<boolean>(false);

  const allFaqs = faqCategories?.flatMap((cat: IFaq) => cat.faqs) || [];

  const filteredFaqs = activeFilter === "all"
    ? allFaqs
    : faqCategories?.find((cat: IFaq) => cat.type === activeFilter)?.faqs || [];
console.log(filteredFaqs,"olikjoasdjfo",allFaqs)
  const [parent, tapes, setTapes] = useDragAndDrop<HTMLDivElement, faqitem>(filteredFaqs);

  // Update tapes when filter changes
  useEffect(() => {
    if (!isLoading) {
      const updatedFaqs = activeFilter === "all"
        ? allFaqs
        : faqCategories?.find((cat: IFaq) => cat.type === activeFilter)?.faqs || [];
      setTapes(updatedFaqs);
      setHasChanges(false); // Reset hasChange when filter changes
    }
  }, [isLoading, activeFilter, faqCategories, setTapes]);

  // Detect if user reordered
  useEffect(() => {
    if (!isLoading && tapes.length > 0) {
      setHasChanges(true);
    }
  }, [tapes, isLoading]);

  if (isLoading) {
    return <div className="text-white text-center py-8">Loading FAQs...</div>;
  }

  if (!faqCategories?.length) {
    return <div className="text-white text-center py-8">No FAQs available</div>;
  }
console.log(faqCategories,tapes)
  const savePositions = async () => {
    const payload = tapes.map((item, index) => ({
      id: item.id,
      position: index + 1,
    }));

    try {
      await api_url.put("/api/faq", payload);
      await refetch();
      Swal.fire({
        title: "Positions updated!",
        icon: "success",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
      setHasChanges(false); // after saving, no more changes
    } catch (err: any) {
      Swal.fire({
        title: "Failed to update!",
        text: err.message,
        icon: "error",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
    }
  };

  return (
    <div className="py-8 max-w-4xl mx-auto">
      {/* Header + Filters */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Pricing Dashboard</h1>
          <p className="text-gray-400">Manage your Pricing</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Filter Dropdown */}
          <select
            onChange={(e) => setActiveFilter(e.target.value)}
            value={activeFilter}
            className="bg-[#101828] w-[200px] border border-slate-300 rounded-lg p-2 text-white"
          >
            {[
              "all",
              "main",
              "shorts",
              "talking",
              "podcast",
              "graphic",
              "advertising",
              "website",
            ].map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          {/* Add FAQ Button */}
          <Link
            href="/create-faq"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Price
          </Link>

          {/* Save Button */}
          {isHasChange && (
            <button
              onClick={savePositions}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Save Positions
            </button>
          )}
        </div>
      </div>

      {/* FAQ List */}
      <div ref={parent} className="space-y-4">
        {tapes.map((item, index) => (
          <Accordion item={item} index={index} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Faqs;
