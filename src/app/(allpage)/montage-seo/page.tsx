'use client'
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useForm, Controller } from 'react-hook-form';
import { SeoMeta } from './interface';

interface SeoMetaFormProps {
  initialData?: SeoMeta | null;
  onSubmit: (data: SeoMeta) => void;
}

const pageOptions = [
  { value: 'main', label: 'Main Page' },
  { value: 'shorts', label: 'Shorts' },
  { value: 'talking', label: 'Talking' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'graphic', label: 'Graphic' },
  { value: 'advertising', label: 'Advertising' },
  { value: 'website', label: 'Website' },
  { value: 'about', label: 'About' },
  { value: 'terms', label: 'Terms' },
  { value: 'privacy', label: 'Privacy' },
  { value: 'contact', label: 'Contact' },
  { value: 'blog', label: 'Blog' },
];

const robotsOptions = [
  { value: 'index, follow', label: 'Index, Follow' },
  { value: 'noindex, nofollow', label: 'Noindex, Nofollow' },
  { value: 'index, nofollow', label: 'Index, Nofollow' },
  { value: 'noindex, follow', label: 'Noindex, Follow' },
];

const SeoMetaForm: React.FC<SeoMetaFormProps> = ({ initialData, onSubmit }) => {
  const { register, handleSubmit, control, reset, setValue } = useForm<SeoMeta>();
  const [keywords, setKeywords] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      if (initialData.metaKeywords) {
        const keywordArray = initialData.metaKeywords.split(',').map(k => ({
          value: k.trim(),
          label: k.trim()
        }));
        setKeywords(keywordArray);
      }
    } else {
      reset({
        id: 0,
        page_name: 'main',
        metaTitle: '',
        metaDescription: '',
        robots: 'index, follow'
      });
    }
  }, [initialData, reset]);

  const handleKeywordsChange = (newValue: any) => {
    setKeywords(newValue);
    const keywordsString = newValue.map((k: any) => k.value).join(', ');
    setValue('metaKeywords', keywordsString);
  };

  const formatKeywords = (inputValue: string) => {
    return {
      value: inputValue,
      label: inputValue
    };
  };

  return (
    <div className="max-w-5xl mx-auto  bg-black rounded-lg shadow-md ">
      <h2 className="text-2xl font-bold mb-6 ">
        {initialData ? 'Edit SEO Meta' : 'Create New SEO Meta'}
      </h2>
      
      <form className='border rounded-md border-white p-8' onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6">
          <div className='space-y-2'>
            <label className="block text-sm font-medium text-gray-300 mb-1">Page</label>
            <Controller
              name="page_name"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={pageOptions}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  isDisabled={!!initialData}
                />
              )}
            />
          </div>

          <div className='space-y-2'>
            <label className="block text-sm font-medium text-gray-300 mb-1">Meta Title</label>
            <input
              {...register('metaTitle', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter meta title"
            />
          </div>

          <div className='space-y-2'>
            <label className="block text-sm font-medium text-gray-300 mb-1">Meta Description</label>
            <textarea
              {...register('metaDescription', { required: true })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter meta description"
            />
          </div>

          <div className='space-y-2'>
            <label className="block text-sm font-medium text-gray-300 mb-1">Meta Keywords</label>
            <CreatableSelect
              isMulti
              value={keywords}
              onChange={handleKeywordsChange}
              onCreateOption={(inputValue) => {
                const newKeyword = formatKeywords(inputValue);
                setKeywords([...keywords, newKeyword]);
                setValue(
                  'metaKeywords',
                  [...keywords, newKeyword].map(k => k.value).join(', ')
                );
              }}
              options={[]}
              formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: '50px'
                })
              }}
              placeholder="Type and press enter to add keywords"
            />
          </div>

          <div className='space-y-2'>
            <label className="block text-sm font-medium text-gray-300 mb-1">Canonical URL</label>
            <input
              {...register('canonicalUrl')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter canonical URL"
            />
          </div>

          <div className='space-y-2'>
            <label className="block text-sm font-medium text-gray-300 mb-1">Robots Directive</label>
            <Controller
              name="robots"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={robotsOptions}
                  defaultValue={robotsOptions[0]}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              )}
            />
          </div>

          <div className='space-y-2'>
            <label className="block text-sm font-medium text-gray-300 mb-1">OG Title</label>
            <input
              {...register('ogTitle')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Open Graph title"
            />
          </div>

          <div className='space-y-2'>
            <label className="block text-sm font-medium text-gray-300 mb-1">OG Description</label>
            <textarea
              {...register('ogDescription')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Open Graph description"
            />
          </div>

          <div className='space-y-2'>
            <label className="block text-sm font-medium text-gray-300 mb-1">OG Image URL</label>
            <input
              {...register('ogImage')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Open Graph image URL"
            />
          </div>

          <div className='space-y-2'>
            <label className="block text-sm font-medium text-gray-300 mb-1">Schema Markup</label>
            <textarea
              {...register('schema')}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="Enter schema.org markup (JSON-LD)"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {initialData ? 'Update SEO Meta' : 'Create SEO Meta'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SeoMetaForm;