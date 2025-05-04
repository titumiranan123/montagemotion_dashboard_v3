"use client";
import Accordion from "@/component/faqs/Accordion";
import useFaq from "@/hook/useFaq";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import React, { useEffect, useState } from "react";
import { faqitem, IFaq } from "@/interface/interface";
import Swal from "sweetalert2";
import { api_url } from "@/hook/Apiurl";
import { FaqForm } from "@/component/faqs/Faqform";

const Faqs = () => {
  const { data: faqCategories, isLoading, refetch } = useFaq();
  const [activeFilter, setActiveFilter] = useState<string>("main");
  const [isHasChange, setHasChanges] = useState<boolean>(false);
  const [existingData, setExistingData] = useState<IFaq>();
  const [existingFaqItem, setExistingFaqItem] = useState<faqitem>();
  const [isItemOpen, setItemOpen] = useState(false);
  const filteredCategories =
    faqCategories?.filter((cat: IFaq) => cat.type === activeFilter) || [];
  const allFaqItems =
    filteredCategories?.flatMap((cat: IFaq) => cat.faqs) || [];
  const [parent, tapes, setTapes] = useDragAndDrop<HTMLDivElement, faqitem>(
    allFaqItems,
    { group: "faqItems" }
  );

  // Update tapes when filter changes
  useEffect(() => {
    if (!isLoading) {
      const itemsToShow = faqCategories
        ?.filter((cat: IFaq) => cat.type === activeFilter)
        ?.flatMap((cat: IFaq) => cat.faqs || []);
      setTapes(itemsToShow);
      setHasChanges(false);
    }
  }, [isLoading, activeFilter, faqCategories, setTapes]);

  // Detect if user reordered
  useEffect(() => {
    if (!isLoading && tapes.length > 0) {
      setHasChanges(true);
    }
  }, [tapes, isLoading]);

  const savePositions = async () => {
    const payload = tapes.map((item, index) => ({
      id: item.id,
      position: index + 1,
    }));
    console.log(payload);
    try {
      await api_url.put("/api/faqitem/positions", payload);
      await refetch();
      Swal.fire({
        title: "Positions updated!",
        icon: "success",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
      setHasChanges(false);
    } catch (err: any) {
      console.log(err);
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

  const handleSubmit = async (data: IFaq) => {
    try {
      const url = data.id ? `/api/faq/${data.id}` : "/api/faq";
      data.id ? await api_url.put(url, data) : await api_url.post(url, data);
      refetch();
      Swal.fire({
        title: data.id ? "FAQ updated!" : "FAQ created!",
        icon: "success",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
    } catch (error: any) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
    }
  };

  // const handleItemSubmit = async (data: faqitem) => {
  //   try {
  //     const url = data.id ? `/api/faqitem/${data.id}` : "/api/faqitem";
  //     const response = data.id
  //       ? await api_url.put(url, data)
  //       : await api_url.post(url, data);
  //     refetch();
  //     setItemOpen(false);
  //     Swal.fire({
  //       title: data.id ? "FAQ Item updated!" : "FAQ Item created!",
  //       icon: "success",
  //       background: "#1f2937",
  //       color: "#fff",
  //       confirmButtonColor: "#6366f1",
  //     });
  //   } catch (error: any) {
  //     Swal.fire({
  //       title: "Error!",
  //       text: error.message,
  //       icon: "error",
  //       background: "#1f2937",
  //       color: "#fff",
  //       confirmButtonColor: "#6366f1",
  //     });
  //   }
  // };

  // const handleEditItem = (item: faqitem) => {
  //   setExistingFaqItem(item);
  //   setItemOpen(true);
  // };

  // const handleDeleteItem = async (id: string) => {
  //   const result = await Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //     background: "#1f2937",
  //     color: "#fff",
  //   });

  //   if (result.isConfirmed) {
  //     try {
  //       await api_url.delete(`/api/faqitem/${id}`);
  //       await refetch();
  //       Swal.fire({
  //         title: "Deleted!",
  //         text: "FAQ item has been deleted.",
  //         icon: "success",
  //         background: "#1f2937",
  //         color: "#fff",
  //         confirmButtonColor: "#6366f1",
  //       });
  //     } catch (error: any) {
  //       Swal.fire({
  //         title: "Error!",
  //         text: error.message,
  //         icon: "error",
  //         background: "#1f2937",
  //         color: "#fff",
  //         confirmButtonColor: "#6366f1",
  //       });
  //     }
  //   }
  // };

  if (isLoading) {
    return <div className="text-white text-center py-8">Loading FAQs...</div>;
  }

  if (!faqCategories?.length) {
    return <div className="text-white text-center py-8">No FAQs available</div>;
  }

  return (
    <div className="text-gray-100 p-4 md:p-8">
      {/* Header + Filters */}
      <div className="flex justify-between  items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">FAQ Dashboard</h1>
          <p className="text-gray-400">Manage your FAQs</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Filter Dropdown */}
          <select
            onChange={(e) => setActiveFilter(e.target.value)}
            value={activeFilter}
            className="bg-[#101828] w-[200px] border border-slate-300 rounded-lg p-2 text-white"
          >
            {[
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
          <button
            onClick={() => {
              setExistingData(undefined);
              setItemOpen(true);
            }}
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
            Add FAQ Category
          </button>

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
      {filteredCategories.map((faq: IFaq) => (
        <div key={faq.id} className="mb-12">
          <div className="flex justify-center flex-col items-center mb-4">
            <div className="flex justify-center items-center gap-1 flex-col">
              <h2 className="text-2xl font-bold">{faq.title}</h2>
              <p className="text-gray-400">{faq.sub_title}</p>
            </div>
            <div ref={parent} className="space-y-4">
              {tapes
                ?.filter((item) => item?.faq_id === faq?.id)
                .map((item, index) => (
                  <Accordion key={item?.id} item={item} index={index} />
                ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                setExistingData(faq);
                setItemOpen(true);
              }}
              className="text-indigo-400 hover:text-indigo-300"
            >
              Edit Category
            </button>
            <button
              // onClick={() => {
              //   setExistingFaqItem({
              //     id: "",
              //     faq_id: faq.id || "",
              //     question: "",
              //     answer: "",
              //     is_visible: true,
              //     position: tapes.filter((i) => i.faq_id === faq.id).length + 1,
              //   });
              //   setItemOpen(true);
              // }}
              className="mt-4 text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add FAQ Item
            </button>
          </div>
        </div>
      ))}

      {/* Modals */}
      {isItemOpen && (
        <div className="fixed inset-0  bg-black/10  backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-scroll">
          <FaqForm
            initialData={existingData}
            onSubmit={handleSubmit}
            onCancel={() => setItemOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Faqs;
