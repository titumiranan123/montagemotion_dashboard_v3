"use client";
import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import { api_url } from "@/hook/Apiurl";
import useSeo from "@/hook/useSeo";
import { SeoMeta } from "./interface";

const SeoMetaForm: React.FC = () => {
  const { data, isLoading, refetch } = useSeo();
  const { register, handleSubmit, control, reset, setValue } =
    useForm<SeoMeta>();

  const [keywords, setKeywords] = useState<{ value: string; label: string }[]>(
    []
  );
  const [activeFilter, setActiveFilter] =
    useState<SeoMeta["page_name"]>("main");

  const initialData: SeoMeta | undefined =
    data?.find((seo: SeoMeta) => seo.page_name === activeFilter);
console.log(initialData)
  useEffect(() => {
    if (initialData) {
      reset(initialData);
      if (initialData.metaKeywords) {
        const keywordArray = initialData.metaKeywords.split(",").map((k) => ({
          value: k.trim(),
          label: k.trim(),
        }));
        setKeywords(keywordArray);
      }
    } else {
      reset({
        id: 0,
        page_name: activeFilter,
        metaTitle: "",
        metaDescription: "",
        robots: "index, follow",
        metaKeywords: "",
        canonicalUrl: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        schema: "",
      });
      setKeywords([]);
    }
  }, [initialData, activeFilter, reset]);

  const handleKeywordsChange = (newValue: any) => {
    setKeywords(newValue);
    const keywordsString = newValue.map((k: any) => k.value).join(", ");
    setValue("metaKeywords", keywordsString);
  };

  const onSubmit = async (formData: SeoMeta) => {
    try {
      console.log(formData);
      const res = await api_url.post(`/api/seo`, formData);
      refetch();
      Swal.fire({
        icon: "success",
        title: "SEO Meta Saved Successfully",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
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
    <div className="p-5">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">SEO</h1>
          <p className="text-gray-400">Manage all Page SEO</p>
        </div>
        <div>
          <select
            value={activeFilter}
            onChange={(e) =>
              setActiveFilter(e.target.value as SeoMeta["page_name"])
            }
            className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
          >
            {[
              "main",
              "shorts",
              "talking",
              "podcast",
              "graphic",
              "advertising",
              "website",
              "about",
              "terms",
              "privacy",
              "contact",
              "blog",
            ].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-black rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 px-8 pt-8">
          {initialData ? "Edit SEO Meta" : "Create New SEO Meta"}
        </h2>

        <form
          className="border rounded-md border-white p-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Meta Title
              </label>
              <input
                {...register("metaTitle", { required: true })}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white"
                placeholder="Enter meta title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Meta Description
              </label>
              <textarea
                {...register("metaDescription", { required: true })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white"
                placeholder="Enter meta description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Meta Keywords
              </label>
              <CreatableSelect
                isMulti
                value={keywords}
                onChange={handleKeywordsChange}
                onCreateOption={(inputValue) => {
                  const newKeyword = { value: inputValue, label: inputValue };
                  const newKeywords = [...keywords, newKeyword];
                  setKeywords(newKeywords);
                  setValue(
                    "metaKeywords",
                    newKeywords.map((k) => k.value).join(", ")
                  );
                }}
                className="react-select-container text-black"
                classNamePrefix="react-select"
                placeholder="Type and press enter to add keywords"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Canonical URL
              </label>
              <input
                {...register("canonicalUrl")}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white"
                placeholder="Enter canonical URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Robots Directive
              </label>
              <select
                {...register("robots")}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white"
              >
                <option value="index, follow">Index, Follow</option>
                <option value="noindex, nofollow">Noindex, Nofollow</option>
                <option value="index, nofollow">Index, Nofollow</option>
                <option value="noindex, follow">Noindex, Follow</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                OG Title
              </label>
              <input
                {...register("ogTitle")}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white"
                placeholder="Enter OG title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                OG Description
              </label>
              <textarea
                {...register("ogDescription")}
                rows={3}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white"
                placeholder="Enter OG description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                OG Image URL
              </label>
              <input
                {...register("ogImage")}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white"
                placeholder="Enter OG image URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Schema Markup
              </label>
              <textarea
                {...register("schema")}
                rows={4}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white font-mono text-sm"
                placeholder="Enter schema JSON-LD"
              />
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                Save SEO Meta
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SeoMetaForm;
