'use client'
import PackageCard from '@/component/pricing/PricingCard';
import PricingForm from '@/component/pricing/Pricingform';
import { api_url } from '@/hook/Apiurl';
import useService from '@/hook/useService';
import { IService } from '@/interface/interface';
import { useDragAndDrop } from '@formkit/drag-and-drop/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';



const PackageGrid = () => {

  const [isHaschange, setHasChanges] = useState<boolean>(false);
  const { data: services, isLoading,refetch } = useService();
  const [parent, tapes, setTapes] = useDragAndDrop<HTMLDivElement, IService>(
    services || []
  );
  useEffect(() => {
    if (!isLoading && services) {
      setTapes(services);
    }
  }, [services]);
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
      refetch()
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
            <h1 className="text-3xl font-bold text-white">
              Campaign Dashboard
            </h1>
            <p className="text-gray-400">Manage your advertising campaigns</p>
          </div>
          <Link
            href={'/create-pricing'}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 flex items-center gap-2"
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
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Save Positions
              </button>
            )}
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      </div>
        <PricingForm />
    </div>
  );
};
const packages = [
      {
        "id": 1,
        "is_visible": true,
        "name": "Basic",
        "title": "Podcast Basic Shorts",
        "description": "Perfect for creators just starting out with quality editing",
        "currency": "USD",
        "price": 25,
        "unit": "short",
        "pricing_type": "single",
        "type": "podcast",
        "note": "4-day delivery | 2 revisions included",
        "purchase_link": "https://checkout.example.com/basic",
        "features": [
          {
            "feature": "Professional Color Grading",
            "is_present": "included",
            "is_active": true,
            "position": 1
          },
          {
            "feature": "Audio Enhancement",
            "is_present": "included",
            "is_active": true,
            "position": 2
          },
          {
            "feature": "Basic Motion Graphics",
            "is_present": "included",
            "is_active": true,
            "position": 3
          },
          {
            "feature": "Custom Thumbnail",
            "is_present": "included",
            "is_active": true,
            "position": 4
          }
        ]
      },
      {
        "id": 2,
        "is_visible": true,
        "name": "Standard",
        "title": "Podcast Standard Shorts",
        "description": "Enhanced editing for growing channels",
        "currency": "USD",
        "price": 35,
        "unit": "short",
        "pricing_type": "single",
        "type": "podcast",
        "note": "Priority 4-day delivery | 2 revisions",
        "purchase_link": "https://checkout.example.com/standard",
        "features": [
          {
            "feature": "Premium Color Grading",
            "is_present": "included",
            "is_active": true,
            "position": 1
          },
          {
            "feature": "Sound Design",
            "is_present": "included",
            "is_active": true,
            "position": 2
          },
          {
            "feature": "Animated Text",
            "is_present": "included",
            "is_active": true,
            "position": 3
          },
          {
            "feature": "2 Thumbnail Options",
            "is_present": "included",
            "is_active": true,
            "position": 4
          }
        ]
      },
      {
        "id": 3,
        "is_visible": true,
        "name": "Premium",
        "title": "Podcast Premium Package",
        "description": "Studio-quality editing for professional creators",
        "currency": "USD",
        "price": 200,
        "unit": "package",
        "pricing_type": "combo",
        "type": "podcast",
        "note": "15 shorts bundle (Save 33%) | 4-day delivery",
        "purchase_link": "https://checkout.example.com/premium",
        "features": [
          {
            "feature": "Cinematic Color Grading",
            "is_present": "included",
            "is_active": true,
            "position": 1
          },
          {
            "feature": "Professional Sound Mixing",
            "is_present": "included",
            "is_active": true,
            "position": 2
          },
          {
            "feature": "Custom Motion Graphics",
            "is_present": "included",
            "is_active": true,
            "position": 3
          },
          {
            "feature": "Multiple Thumbnail Designs",
            "is_present": "included",
            "is_active": true,
            "position": 4
          },
          {
            "feature": "Priority Editing Queue",
            "is_present": "included",
            "is_active": true,
            "position": 5
          }
        ]
      }
    ]


export default PackageGrid;