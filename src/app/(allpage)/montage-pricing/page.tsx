"use client";
import PackageCard from "@/component/pricing/PricingCard";
import { api_url } from "@/hook/Apiurl";
import usePrice from "@/hook/usePrice";
// import { IPackage, IService } from "@/interface/interface";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const PackageGrid = () => {
  const [isHaschange, setHasChanges] = useState<boolean>(false);
  const { data: price, isLoading, refetch } = usePrice();
  const [activeFilter, setActiveFilter] = useState<any["type"]>("main");
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  const [parent, tapes, setTapes] = useDragAndDrop<HTMLDivElement, any>(
    filteredItems
  );

  useEffect(() => {
    if (price) {
      const filtered = price.filter((item: any) => item.type === activeFilter);
      setFilteredItems(filtered);
      setTapes(filtered);
    }
  }, [price, activeFilter]);

  useEffect(() => {
    setHasChanges(true);
  }, [tapes]);

  const savePositions = async () => {
    const payload = tapes.map((item, index) => ({
      id: item.id,
      position: index + 1,
    }));

    try {
      await api_url.put("/api/pricing", payload);
      refetch();
      Swal.fire({
        title: "Positions updated!",
        icon: "success",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
      // setHasChanges(false);
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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold ">Pricing Dashboard</h1>
          <p className="text-gray-400">Manage your Pricing</p>
        </div>

        <div className="flex gap-4 items-center">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as any["type"])}
            className="bg-gray-800 border text-white border-gray-600 rounded px-3 py-2"
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
                {type}
              </option>
            ))}
          </select>
          <Link
            href={"/montage-create-pricing"}
            className="bg-[#1FB5DD]    text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 flex items-center gap-2"
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
          {isHaschange && (
            <button
              onClick={savePositions}
              className="bg-[#1FB5DD] hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Save Positions
            </button>
          )}
        </div>
      </div>
      {isLoading ? (
        <div className="flex min-h-[90v] items-center text-white">
          Loading .....{" "}
        </div>
      ) : (
        <div
          ref={parent}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {tapes.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} refetch={refetch} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PackageGrid;
