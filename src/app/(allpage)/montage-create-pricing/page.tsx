"use client";
import { api_url } from "@/hook/Apiurl";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { animations } from "@formkit/drag-and-drop";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

export interface IFeature {
  feature: string;
  is_present: boolean;
  is_active: boolean;
  position: number;
}

export interface IPackage {
  id: number;
  is_visible: boolean;
  name: "Basic" | "Standard" | "Premium";
  title: string;
  description: string;
  currency: string;
  price: number;
  unit: string;
  features: IFeature[];
  note: string;
  purchase_link: string;
  pricing_type: "single" | "combo";
  type: "main" | "shorts" | "talking" | "podcast" | "graphic" | "advertising" | "website";
}

const defaultFeature: IFeature = {
  feature: "",
  is_present: true,
  is_active: true,
  position: 0,
};

const defaultPackage: IPackage = {
  id: Date.now(),
  is_visible: true,
  name: "Basic",
  title: "",
  description: "",
  currency: "BDT",
  price: 0,
  unit: "short",
  features: [],
  note: "",
  purchase_link: "",
  pricing_type: "single",
  type: "podcast",
};

const PricingForm = () => {
  const { register, handleSubmit, setValue, watch } = useForm<IPackage>({
    defaultValues: defaultPackage
  });

  const formValues = watch();
  const [isHaschange, setHasChanges] = useState<boolean>(false);

  const [parent, tapes, setTapes] = useDragAndDrop<HTMLDivElement, IFeature>(
    formValues.features || [],
    {
      group: "features",
      dragHandle: ".drag-handle",
      plugins: [animations()],
    }
  );

  useEffect(() => {
    if (tapes.length > 0) {
      const featuresWithUpdatedPositions = tapes.map((feature, index) => ({
        ...feature,
        position: index
      }));
      setValue("features", featuresWithUpdatedPositions, { shouldDirty: true });
    }
  }, [tapes, setValue]);

  useEffect(() => {
    setHasChanges(true);
  }, [tapes]);

  const onSubmit: SubmitHandler<IPackage> = async (data) => {
    console.log("Form submitted:", data);
    try {
      const res = await api_url.post(`/api/pricing`, data);
      console.log(res);
      toast.success("Package added successfully 🎉");
    } catch (error) {
      console.log(error);
      toast.error("Package add failed ❌");
    }
  };

  const addFeature = () => {
    const newFeatures = [...formValues.features, {
      ...defaultFeature,
      position: formValues.features.length,
    }];
    setValue("features", newFeatures);
    setTapes(newFeatures);
  };

  const removeFeature = (featureIndex: number) => {
    const newFeatures = formValues.features.filter((_, i) => i !== featureIndex);
    setValue("features", newFeatures);
    setTapes(newFeatures);
  };

  const handleFeatureChange = (index: number, field: keyof IFeature, value: any) => {
    const updatedFeatures = [...tapes];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [field]: value
    };
    setTapes(updatedFeatures);
    setValue("features", updatedFeatures);
  };

  return (
    <div className="min-h-screen text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 ">Pricing Packages Editor</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="border border-gray-700 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6 pb-4 border-b border-gray-700">
              {formValues.name} Package
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Package Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Package Tier
                </label>
                <select
                  {...register("name")}
                  className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Title
                </label>
                <input
                  type="text"
                  {...register("title")}
                  className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              {/* Content Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content Type
                </label>
                <select
                  {...register("type")}
                  className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="main">Main</option>
                  <option value="shorts">Shorts</option>
                  <option value="talking">Talking</option>
                  <option value="podcast">Podcast</option>
                  <option value="graphic">Graphic</option>
                  <option value="advertising">Advertising</option>
                  <option value="website">Website</option>
                </select>
              </div>

              {/* Pricing Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pricing Model
                </label>
                <select
                  {...register("pricing_type")}
                  className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="single">Per Unit</option>
                  <option value="combo">Package Deal</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price
                </label>
                <div className="flex">
                  <select
                    {...register("currency")}
                    className="p-3 border border-gray-600 rounded-l-md bg-gray-700 text-white"
                  >
                    <option value="USD">$ USD</option>
                    <option value="BDT">BDT</option>
                  </select>
                  <input
                    type="number"
                    {...register("price", { valueAsNumber: true })}
                    className="flex-1 p-3 border-t border-b border-r border-gray-600 rounded-r-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Unit Type
                </label>
                <input
                  type="text"
                  {...register("unit")}
                  className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., video, hour, project"
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Short Note
                </label>
                <input
                  type="text"
                  {...register("note")}
                  className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., '4-day delivery'"
                />
              </div>

              {/* Purchase Link */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Purchase URL
                </label>
                <input
                  type="url"
                  {...register("purchase_link")}
                  className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://..."
                />
              </div>

              {/* Visibility Toggle */}
              <div className="flex items-center md:col-span-2">
                <input
                  type="checkbox"
                  id="visible"
                  {...register("is_visible")}
                  className="h-5 w-5 text-[#1FB5DD] rounded focus:ring-blue-500 border-gray-600 bg-gray-700"
                />
                <label htmlFor="visible" className="ml-3 text-sm text-gray-300">
                  Visible to customers
                </label>
              </div>
            </div>

            {/* Features Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700">
                <h3 className="text-lg font-medium text-white">Package Features</h3>
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded hover:bg-blue-900/50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Feature
                </button>
              </div>

              {formValues.features.length > 0 ? (
                <div ref={parent} className="space-y-3">
                  {tapes.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex} 
                      className="grid grid-cols-12 gap-3 items-center bg-gray-700/30 p-3 rounded-lg"
                      data-drag-item
                    >
                      {/* Drag Handle */}
                      <div className="col-span-1 flex items-center justify-center drag-handle cursor-move">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </div>

                      {/* Feature Name */}
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={feature.feature}
                          onChange={(e) => handleFeatureChange(featureIndex, "feature", e.target.value)}
                          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Feature description"
                        />
                      </div>

                      {/* Inclusion Status */}
                      <div className="col-span-3 gap-2 flex justify-center">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={feature.is_present}
                            onChange={(e) => handleFeatureChange(featureIndex, "is_present", e.target.checked)}
                            className="h-5 w-5 text-[#1FB5DD] rounded focus:ring-blue-500 border-gray-600 bg-gray-700"
                          />
                          <span>Is Present</span>
                        </label>
                      </div>

                      {/* Active Status */}
                      <div className="col-span-3 gap-2 flex justify-center">
                        <label className="inline-flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={feature.is_active}
                            onChange={(e) => handleFeatureChange(featureIndex, "is_active", e.target.checked)}
                            className="h-5 w-5 text-[#1FB5DD] rounded focus:ring-blue-500 border-gray-600 bg-gray-700"
                          />
                          <span>Is Active</span>
                        </label>
                      </div>

                      {/* Remove Button */}
                      <div className="col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeFeature(featureIndex)}
                          className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-red-900/50 transition-colors"
                          title="Remove feature"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400 border border-gray-700 rounded-lg">
                  No features added yet. Click "Add Feature" to create your first one.
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-700">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1FB5DD] hover:bg-green-700 text-white font-medium rounded-md transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Save Package
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PricingForm;