"use client";
import { api_url } from "@/hook/Apiurl";
import { IFeature, IPackage } from "@/interface/interface";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

interface PackageCardProps {
  pkg: IPackage;
  refetch:()=>void
  // onFeatureReorder?: (packageId: string, features: IFeature[]) => void;
}

const PackageCard = ({ pkg ,refetch}: PackageCardProps) => {
  const [isHaschange,setHasChanges] = useState(false)
  const [features, setFeatures] = useState<IFeature[]>(pkg.features || []);
  const [parent, draggedFeatures] = useDragAndDrop<HTMLUListElement, IFeature>(
    features,
    {
      group: `package-${pkg.id}`, // Optional: Only needed if you want cross-card dragging
    }
  );
  console.log(draggedFeatures, "darag feature");
  // Initialize features when package changes
  useEffect(() => {
    setFeatures(pkg.features || []);
  }, [pkg.features]);

  // Handle feature reordering
  useEffect(() => {
    if (JSON.stringify(draggedFeatures) !== JSON.stringify(features)) {
      const updatedFeatures = draggedFeatures.map((feat, index) => ({
        ...feat,
        position: index + 1,
      }));
      setFeatures(updatedFeatures);
      setHasChanges(true)
    }
  }, [draggedFeatures]);
  const savePositions = async () => {
    const payload = draggedFeatures.map((item, index) => ({
      id: item.id,
      position: index + 1,
    }));

    try {
      await api_url.put(`/api/pricing/feature/${pkg.id}`, payload);
      // refetch()
      Swal.fire({
        title: "Positions updated!",
        icon: "success",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
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
  const handleDelete = async ()=>{
    try {
      const res = await api_url.delete(`/api/pricing/${pkg.id}`)
      if(res.status === 200){
        refetch()
        toast.success('Delete successfully')
      }
      console.log(res)
    } catch (error) {
      toast.error('Delete failed ❌')
    }
  }
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-gray-800">
      {/* Price Section */}
      <div
        className={`p-6 text-center border-b ${
          pkg.pricing_type === "combo" ? "bg-purple-600" : "bg-blue-600"
        }`}
      >
        <div className="text-4xl font-bold">
          {pkg.currency}
          {pkg.price}
          {pkg.pricing_type === "single" && (
            <span className="text-lg font-normal">/{pkg.unit}</span>
          )}
        </div>
        {pkg.pricing_type === "combo" && (
          <div className="mt-1 text-sm text-green-200">
            Save 33% compared to individual purchases
          </div>
        )}
      </div>

      {/* Title & Description */}
      <div className="p-6 text-white">
        <h3 className="text-xl font-semibold">{pkg.title}</h3>
        <p className="mt-2 text-gray-300">{pkg.description}</p>
      </div>

      {/* Features List */}
      <div className="px-6 pb-4">
      { isHaschange && <button onClick={()=>savePositions()} className="px-3 py-2 border text-white">Save Changes</button>}
        <ul ref={parent} className="space-y-3 text-white min-h-[100px]">
          {draggedFeatures.map((feature, index) => (
            <li
              key={feature.id || index}
              className="flex items-start p-2 rounded hover:bg-gray-700 transition-colors cursor-grab active:cursor-grabbing"
              data-feature-id={feature.id}
            >
              {feature.is_active ? (
                <>
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{feature.feature}</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="text-gray-400 line-through">
                    {feature.feature}
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Note Section */}
      {pkg.note && (
        <div className="px-6 py-4 text-white border-t border-gray-700">
          <p className="text-sm text-gray-400 italic">{pkg.note}</p>
        </div>
      )}

      {/* Purchase Button */}
      <div className="p-6">
        <a
          href={pkg.purchase_link}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Purchase Now
        </a>
      </div>
      <div>
        <button onClick={handleDelete} className="py-2 px-4 border w-[250px] ">Delete</button>
      </div>
    </div>
  );
};

export default PackageCard;
