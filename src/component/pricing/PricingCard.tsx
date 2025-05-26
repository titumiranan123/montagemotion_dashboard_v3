"use client";
import { api_url } from "@/hook/Apiurl";
import { IFeature, IPackage } from "@/interface/interface";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FiEdit, FiTrash2, FiSave, FiX, FiCheck, FiPlus } from "react-icons/fi";

interface PackageCardProps {
  pkg: IPackage;
  refetch: () => void;
}

const PackageCard = ({ pkg, refetch }: PackageCardProps) => {
  const [isHasChange, setHasChanges] = useState(false);
  const [features, setFeatures] = useState<IFeature[]>(pkg.features || []);
  const [isEditing, setIsEditing] = useState(false);
  const [editPackageData, setEditPackageData] = useState<Partial<IPackage>>(pkg);
  const [isEditingFeature, setIsEditingFeature] = useState<string | null>(null);
  const [editFeatureData, setEditFeatureData] = useState<Partial<IFeature>>({});
  const [isAddingFeature, setIsAddingFeature] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [parent, draggedFeatures] = useDragAndDrop<HTMLUListElement, IFeature>(
    features,
    { group: `package-${pkg.id}` }
  );

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
      setHasChanges(true);
    }
  }, [draggedFeatures]);

  const savePositions = async () => {
    setIsLoading(true);
    const payload = draggedFeatures.map((item, index) => ({
      id: item.id,
      position: index + 1,
    }));

    try {
      await api_url.put(`/api/pricing/feature/${pkg.id}`, payload);
      setHasChanges(false);
      refetch();
      toast.success("Feature positions updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update positions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePackage = async () => {
    const result = await Swal.fire({
      title: "Delete Package?",
      text: "This will permanently delete this package and all its features",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      background: "#1f2937",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await api_url.delete(`/api/pricing/${pkg.id}`);
        refetch();
        toast.success("Package deleted successfully");
      } catch (error) {
        toast.error("Failed to delete package");
      }
    }
  };

  const handleUpdatePackage = async () => {
    setIsLoading(true);
    try {
      await api_url.patch(`/api/pricing/${pkg.id}`, editPackageData);
      setIsEditing(false);
      refetch();
      toast.success("Package updated successfully!");
    } catch (err: any) {

      toast.error(err.message || "Failed to update package");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditFeature = (feature: IFeature) => {
    setIsEditingFeature(feature.id);
    setEditFeatureData({
      feature: feature.feature,
      is_active: feature.is_active,
    });
  };

  const handleUpdateFeature = async (featureId: string) => {
    setIsLoading(true);
    try {
      await api_url.patch(`/api/pricing/feature/${featureId}`, editFeatureData);
      refetch();
      setIsEditingFeature(null);
      toast.success("Feature updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update feature");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFeature = async (featureId: string) => {
    const result = await Swal.fire({
      title: "Delete Feature?",
      text: "This will permanently delete this feature",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      background: "#1f2937",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await api_url.delete(`/api/pricing/feature/${featureId}`);
        refetch();
        toast.success("Feature deleted successfully");
      } catch (error) {
        toast.error("Failed to delete feature");
      }
    }
  };

  const handleAddFeature = async () => {
    if (!newFeature.trim()) return;
    
    setIsLoading(true);
    try {
      await api_url.post(`/api/pricing/${pkg.id}/feature`, {
        feature: newFeature,
        is_active: true,
      });
      setNewFeature("");
      setIsAddingFeature(false);
      refetch();
      toast.success("Feature added successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to add feature");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-gray-800 relative">
      {/* Card Header with Edit Controls */}
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 bg-[#1FB5DD] rounded-full    transition-colors"
            title="Edit Package"
          >
            <FiEdit className="text-white" />
          </button>
        )}
        <button
          onClick={handleDeletePackage}
          className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
          title="Delete Package"
        >
          <FiTrash2 className="text-white" />
        </button>
      </div>

      {/* Price Section */}
      <div
        className={`p-6 text-center border-b ${
          pkg.pricing_type === "combo" ? "bg-purple-600" : "bg-[#1FB5DD]"
        }`}
      >
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editPackageData.currency || ""}
              onChange={(e) =>
                setEditPackageData({ ...editPackageData, currency: e.target.value })
              }
              className="w-12 text-center bg-gray-700 text-white rounded p-1"
              placeholder="$"
            />
            <input
              type="number"
              value={editPackageData.price || ""}
              onChange={(e) =>
                setEditPackageData({ ...editPackageData, price: parseFloat(e.target.value) })
              }
              className="w-full text-4xl font-bold bg-gray-700 text-white rounded p-1 text-center"
            />
            {editPackageData.pricing_type === "single" && (
              <div className="flex justify-center items-center gap-2">
                <span className="text-lg font-normal">/</span>
                <input
                  type="text"
                  value={editPackageData.unit || ""}
                  onChange={(e) =>
                    setEditPackageData({ ...editPackageData, unit: e.target.value })
                  }
                  className="w-20 bg-gray-700 text-white rounded p-1"
                  placeholder="month"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-4xl font-bold">
            {pkg.currency}
            {pkg.price}
            {pkg.pricing_type === "single" && (
              <span className="text-lg font-normal">/{pkg.unit}</span>
            )}
          </div>
        )}
        {pkg.pricing_type === "combo" && (
          <div className="mt-1 text-sm text-green-200">
            Save 33% compared to individual purchases
          </div>
        )}
      </div>

      {/* Title & Description */}
      <div className="p-6 text-white">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editPackageData.title || ""}
              onChange={(e) =>
                setEditPackageData({ ...editPackageData, title: e.target.value })
              }
              className="w-full text-xl font-semibold bg-gray-700 text-white rounded p-2"
            />
            <textarea
              value={editPackageData.description || ""}
              onChange={(e) =>
                setEditPackageData({ ...editPackageData, description: e.target.value })
              }
              className="w-full mt-2 bg-gray-700 text-gray-300 rounded p-2"
              rows={3}
            />
          </div>
        ) : (
          <>
            <h3 className="text-xl font-semibold">{pkg.title}</h3>
            <p className="mt-2 text-gray-300">{pkg.description}</p>
          </>
        )}
      </div>

      {/* Features List */}
      <div className="px-6 pb-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-white">Features</h4>
          {isHasChange && (
            <button
              onClick={savePositions}
              disabled={isLoading}
              className="flex items-center gap-1 px-3 py-1 bg-[#1FB5DD] text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              <FiSave /> {isLoading ? "Saving..." : "Save Order"}
            </button>
          )}
        </div>

        <ul ref={parent} className="space-y-2 text-white min-h-[100px]">
          {draggedFeatures.map((feature) => (
            <li
              key={feature.id}
              className="group flex items-start p-2 rounded hover:bg-gray-700 transition-colors cursor-grab active:cursor-grabbing"
              data-feature-id={feature.id}
            >
              {isEditingFeature === feature.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editFeatureData.is_active || false}
                    onChange={(e) =>
                      setEditFeatureData({ ...editFeatureData, is_active: e.target.checked })
                    }
                    className="h-5 w-5 text-[#1FB5DD] rounded"
                  />
                  <input
                    type="text"
                    value={editFeatureData.feature || ""}
                    onChange={(e) =>
                      setEditFeatureData({ ...editFeatureData, feature: e.target.value })
                    }
                    className="flex-1 bg-gray-700 text-white rounded p-1"
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleUpdateFeature(feature.id)}
                      disabled={isLoading}
                      className="p-1 text-green-500 hover:text-green-400 disabled:opacity-50"
                    >
                      <FiCheck />
                    </button>
                    <button
                      onClick={() => setIsEditingFeature(null)}
                      className="p-1 text-red-500 hover:text-red-400"
                    >
                      <FiX />
                    </button>
                  </div>
                </div>
              ) : (
                <>
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
                      <span className="flex-1">{feature.feature}</span>
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
                      <span className="flex-1 text-gray-400 line-through">
                        {feature.feature}
                      </span>
                    </>
                  )}
                  {isEditing && (
                    <div className="ml-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditFeature(feature)}
                        className="p-1 text-[#1FB5DD] hover:text-[#1FB5DD]"
                      >
                        <FiEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteFeature(feature.id)}
                        className="p-1 text-red-500 hover:text-red-400"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}

          {isAddingFeature && (
            <li className="flex items-center p-2 rounded bg-gray-700">
              <input
                type="checkbox"
                checked
                disabled
                className="h-5 w-5 text-[#1FB5DD] rounded mr-2"
              />
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Enter new feature"
                className="flex-1 bg-gray-600 text-white rounded p-1"
                onKeyDown={(e) => e.key === "Enter" && handleAddFeature()}
              />
              <div className="flex gap-1 ml-2">
                <button
                  onClick={handleAddFeature}
                  disabled={isLoading || !newFeature.trim()}
                  className="p-1 text-green-500 hover:text-green-400 disabled:opacity-50"
                >
                  <FiCheck />
                </button>
                <button
                  onClick={() => setIsAddingFeature(false)}
                  className="p-1 text-red-500 hover:text-red-400"
                >
                  <FiX />
                </button>
              </div>
            </li>
          )}
        </ul>

        {isEditing && (
          <button
            onClick={() => setIsAddingFeature(true)}
            className="mt-2 flex items-center gap-1 px-3 py-1 bg-[#1FB5DD] text-white rounded   "
          >
            <FiPlus /> Add Feature
          </button>
        )}
      </div>

      {/* Note Section */}
      {pkg.note && (
        <div className="px-6 py-4 text-white border-t border-gray-700">
          {isEditing ? (
            <textarea
              value={editPackageData.note || ""}
              onChange={(e) =>
                setEditPackageData({ ...editPackageData, note: e.target.value })
              }
              className="w-full text-sm text-gray-400 italic bg-gray-700 rounded p-2"
              placeholder="Add a note..."
            />
          ) : (
            <p className="text-sm text-gray-400 italic">{pkg.note}</p>
          )}
        </div>
      )}

      {/* Purchase Button */}
      <div className="p-6">
        {isEditing ? (
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdatePackage}
              disabled={isLoading}
              className="flex-1 bg-[#1FB5DD] hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        ) : (
          <a
            href={pkg.purchase_link}
            className="block w-full text-center bg-[#1FB5DD]    text-white font-medium py-3 px-4 rounded-md transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Purchase Now
          </a>
        )}
      </div>
    </div>
  );
};

export default PackageCard;