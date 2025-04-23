import { api_url } from "@/hook/Apiurl";
import Image from "next/image";
import React from "react";
import Swal from "sweetalert2"
interface serviceCardProps {
  service: {
    id: string;
    title: string;
    description: string;
    image: string;
    isPublish: boolean;
    position: number;
  };
}

const Servicecard: React.FC<serviceCardProps> = ({ service }) => {
    const handleDelete = async (id: string): Promise<void> => {
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!',
          reverseButtons: true,
          allowOutsideClick: false,
          backdrop: `
            rgba(0,0,0,0.7)
            url("/images/trash-icon.png")
            center top
            no-repeat
          `
        });
      
        if (result.isConfirmed) {
          try {
            await api_url.delete(`/api/service/${id}`);
            // Show success message
            await Swal.fire({
              title: 'Deleted!',
              text: 'Your campaign has been deleted.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            
          
            
          } catch (err) {
            console.error(err);
            
            // Show error message
            await Swal.fire({
              title: 'Error!',
              text: 'Failed to delete campaign. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      };

  return (
    <div className="md:w-[488px] md:h-[254px] w-full h-auto md:px-[22px] md:py-[66px] px-4 py-10 flex justify-between items-center gap-5 bg-[#58585833] rounded-[9.91px]">
      <Image
        src={service.image}
        alt=""
        priority
        width={121}
        height={121}
      />
      <div className="text-white space-y-3">
        <div className="flex justify-between items-center">
        <h3 className="text-[24px] font-montserrat  font-[600] leading-[33.6px]">
          {service.title}
        </h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          #{service.position}
        </span>
        </div>
        <p>{service.description}</p>
      <div className="flex justify-between items-center border-t pt-4">
        <button className="text-white hover:text-blue-800 font-medium text-sm flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit
        </button>
        <button
          onClick={() => handleDelete(service.id)}
          className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Delete
        </button>
      </div>
      </div>

    </div>
  );
};

export default Servicecard;
