import Image from "next/image";
import { FiEdit2, FiTrash2, FiEye, FiEyeOff, FiStar } from "react-icons/fi";
interface IBlog {
  id?: string;
  title: string;
  short_description: string;
  description: string;
  image: string;
  alt:string
  is_publish?: boolean;
  is_feature?: boolean;
  is_position?:number
  created_at?: Date | undefined;
  updated_at?: Date;
}

interface BlogCardProps {
  blog: IBlog;
  onEdit: (blog: IBlog) => void;
  onDelete: (id: string) => void;
  onTogglePublish?: (id: string, is_publish: boolean) => void;
  onToggleFeature?: (id: string, is_feature: boolean) => void;
}

const BlogCardHorizontal = ({ 
  blog, 
  onEdit, 
  onDelete,
  onTogglePublish,
  onToggleFeature
}: BlogCardProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 rounded-lg shadow-sm  hover:shadow-md transition-shadow bg-white w-[600px]">
      {/* Image */}
      <div className="w-full z-20 md:w-2/4 h-48 relative rounded-lg overflow-hidden">
        <Image
          src={blog.image}
          alt={blog.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
            {blog.title}
          </h3>
          
          {/* Status indicators */}
          <div className="flex gap-2">
            {blog.is_publish !== undefined && (
              <button 
                onClick={() => onTogglePublish?.(blog.id!, !blog.is_publish)}
                className={`p-2 rounded-full ${blog.is_publish ? 'text-[#1FB5DD] bg-green-50' : 'text-gray-500 bg-gray-50'}`}
                aria-label={blog.is_publish ? 'Published' : 'Unpublished'}
              >
                {blog.is_publish ? <FiEye /> : <FiEyeOff />}
              </button>
            )}
            
            {blog.is_feature !== undefined && (
              <button 
                onClick={() => onToggleFeature?.(blog.id!, !blog.is_feature)}
                className={`p-2 rounded-full ${blog.is_feature ? 'text-yellow-600 bg-yellow-50' : 'text-gray-500 bg-gray-50'}`}
                aria-label={blog.is_feature ? 'Featured' : 'Not featured'}
              >
                <FiStar />
              </button>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 mt-2 line-clamp-2">
          {blog.short_description}
        </p>
        
        {/* <div className="mt-2 text-sm text-gray-500">
          {format(new Date(blog.created_at), 'MMM d, yyyy')}
          {blog.updated_at && (
            <span className="ml-2">(Updated: {format(new Date(blog.updated_at), 'MMM d, yyyy')})</span>
          )}
        </div> */}
        
        {/* Action buttons */}
        <div className="mt-auto flex gap-2 pt-4">
          <button
            onClick={() => onEdit(blog)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-[#1FB5DD] rounded hover:bg-blue-100 transition-colors"
          >
            <FiEdit2 size={16} />
            Edit
          </button>
          
          <button
            onClick={() => onDelete(blog.id!)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
          >
            <FiTrash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCardHorizontal;