"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface IFeature {
  feature: string;
  is_present: string;
  is_active: boolean;
  position: number;
}

interface IPackage {
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

interface FormValues {
  packages: IPackage[];
}

const defaultFeature: IFeature = {
  feature: "",
  is_present: "included",
  is_active: true,
  position: 0,
};

const defaultPackage: IPackage = {
  id: Date.now(),
  is_visible: true,
  name: "Basic",
  title: "",
  description: "",
  currency: "USD",
  price: 0,
  unit: "short",
  features: [],
  note: "",
  purchase_link: "",
  pricing_type: "single",
  type: "podcast",
};

const PricingForm = () => {
  const { register, handleSubmit, control, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      packages: [defaultPackage],
    },
  });

  const packages = watch("packages");

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("Form submitted:", data);
    alert(JSON.stringify(data, null, 2));
  };

  const addPackage = () => {
    setValue("packages", [
      ...packages,
      {
        ...defaultPackage,
        id: Date.now(),
      },
    ]);
  };

  const removePackage = (index: number) => {
    const newPackages = packages.filter((_, i) => i !== index);
    setValue("packages", newPackages);
  };

  const addFeature = (pkgIndex: number) => {
    const newPackages = [...packages];
    newPackages[pkgIndex].features.push({
      ...defaultFeature,
      position: newPackages[pkgIndex].features.length,
    });
    setValue("packages", newPackages);
  };

  const removeFeature = (pkgIndex: number, featureIndex: number) => {
    const newPackages = [...packages];
    newPackages[pkgIndex].features = newPackages[pkgIndex].features.filter(
      (_, i) => i !== featureIndex
    );
    setValue("packages", newPackages);
  };

  return (
    <div className="max-w-7xl w-full bg-white mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Pricing Packages Editor</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {packages.map((pkg, pkgIndex) => (
          <div key={pkg.id} className="border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Package {pkgIndex + 1}</h2>
              <button
                type="button"
                onClick={() => removePackage(pkgIndex)}
                className="text-red-500 hover:text-red-700"
              >
                Remove Package
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Package Name
                </label>
                <select
                  {...register(`packages.${pkgIndex}.name`)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  {...register(`packages.${pkgIndex}.title`)}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register(`packages.${pkgIndex}.description`)}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  {...register(`packages.${pkgIndex}.type`)}
                  className="w-full p-2 border rounded-md"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <div className="flex">
                  <select
                    {...register(`packages.${pkgIndex}.currency`)}
                    className="p-2 border rounded-l-md"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                  <input
                    type="number"
                    {...register(`packages.${pkgIndex}.price`, { valueAsNumber: true })}
                    className="flex-1 p-2 border-t border-b border-r rounded-r-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pricing Type
                </label>
                <select
                  {...register(`packages.${pkgIndex}.pricing_type`)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="single">Single</option>
                  <option value="combo">Combo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  {...register(`packages.${pkgIndex}.unit`)}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note
                </label>
                <input
                  type="text"
                  {...register(`packages.${pkgIndex}.note`)}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Link
                </label>
                <input
                  type="url"
                  {...register(`packages.${pkgIndex}.purchase_link`)}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`visible-${pkgIndex}`}
                  {...register(`packages.${pkgIndex}.is_visible`)}
                  className="h-4 w-4 text-[#1FB5DD] rounded"
                />
                <label htmlFor={`visible-${pkgIndex}`} className="ml-2 text-sm text-gray-700">
                  Visible to customers
                </label>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Features</h3>
                <button
                  type="button"
                  onClick={() => addFeature(pkgIndex)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Add Feature
                </button>
              </div>

              {pkg.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="grid grid-cols-12 gap-4 mb-3 items-center">
                  <div className="col-span-5">
                    <input
                      type="text"
                      {...register(`packages.${pkgIndex}.features.${featureIndex}.feature`)}
                      placeholder="Feature name"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="col-span-2">
                    <select
                      {...register(`packages.${pkgIndex}.features.${featureIndex}.is_present`)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="included">Included</option>
                      <option value="extra">Extra</option>
                      <option value="not_included">Not Included</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      {...register(`packages.${pkgIndex}.features.${featureIndex}.position`, {
                        valueAsNumber: true,
                      })}
                      placeholder="Position"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="col-span-2 flex items-center">
                    <input
                      type="checkbox"
                      id={`active-${pkgIndex}-${featureIndex}`}
                      {...register(`packages.${pkgIndex}.features.${featureIndex}.is_active`)}
                      className="h-4 w-4 text-[#1FB5DD] rounded"
                    />
                    <label
                      htmlFor={`active-${pkgIndex}-${featureIndex}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      Active
                    </label>
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() => removeFeature(pkgIndex, featureIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={addPackage}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-[#1FB5DD]"
          >
            Add New Package
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-[#1FB5DD]"
          >
            Save All Packages
          </button>
        </div>
      </form>
    </div>
  );
};

export default PricingForm;