"use client";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { api_url } from "@/hook/Apiurl";
import useWorks from "@/hook/useWorks";
import VideoCard from "@/component/works/Workcard";
import Workform from "@/component/works/Workform";

interface IVideo {
  id?: string;
  title: string;
  description: string;
  thumbnail: string;
  video_link: string;
  is_visible: boolean;
  is_feature: boolean;
  position?: number;
  type:
    | "main"
    | "shorts"
    | "talking"
    | "podcast"
    | "graphic"
    | "advertising"
    | "website";
}

const Works = () => {
  const [isWork, setWorkModal] = useState(false);
  const [editData, setEditData] = useState<IVideo | null>(null);
  const [activeFilter, setActiveFilter] = useState<IVideo["type"]>("main");
  const { data, isLoading, refetch } = useWorks();
  const [hasChanges, setHasChanges] = useState(false);

  const [filteredItems, setFilteredItems] = useState<IVideo[]>([]);
  const [parent, tapes, setTapes] = useDragAndDrop<HTMLDivElement, IVideo>(
    filteredItems
  );

  useEffect(() => {
    if (data) {
      const filtered = data.filter((item: any) => item.type === activeFilter);
      setFilteredItems(filtered);
      setTapes(filtered);
    }
  }, [data, activeFilter]);

  useEffect(() => {
    setHasChanges(true);
  }, [tapes]);

  const savePositions = async () => {
    const payload = tapes.map((item, index) => ({
      id: item.id,
      position: index + 1,
      type: item.type,
    }));

    try {
      await api_url.patch("/api/works/positions", payload);
      Swal.fire({
        title: "Positions updated!",
        icon: "success",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
      refetch();
      setHasChanges(false);
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

  const handleSubmit = async (data: IVideo) => {
    try {
      const res = await api_url.post(
        `/api/works${data.id ? `/${data.id}` : ""}`,
        data
      );
      refetch();
      Swal.fire({
        title: res.data.message,
        icon: "success",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
      setWorkModal(false);
      setEditData(null);
    } catch (err: any) {
      Swal.fire({
        title: "Something went wrong!",
        text: err.message,
        icon: "error",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
    }
  };

  return (
    <div className="min-h-screen text-white p-6">
      {/* Header */}

      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold ">Works Gallery</h1>
          <p className="text-gray-400">Manage and showcase client Works</p>
        </div>
        <div className="flex gap-4">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as IVideo["type"])}
            className="bg-gray-800 border border-gray-600 rounded px-3 py-2"
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

          <div className="flex gap-4">
            <button
              onClick={() => {
                setEditData(null);
                setWorkModal(true);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              + Add Work
            </button>

            {hasChanges && (
              <button
                onClick={savePositions}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save Positions
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <p>Loading...</p>
      ) : tapes.length > 0 ? (
        <div ref={parent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tapes.map((item) => (
            <VideoCard
              key={item.id}
              video={item}
              onEdit={() => {
                setEditData(item);
                setWorkModal(true);
              }}
            />
          ))}
        </div>
      ) : (
        <p>No items found.</p>
      )}

      {/* Modal */}
      {isWork && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start p-8">
          <div className="bg-gray-900 p-6 rounded w-full max-w-2xl">
            <Workform
              initialData={editData}
              onCancel={() => setWorkModal(false)}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Works;
