'use client'
import React from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import useService from "@/hook/useService";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  isPublish: boolean;
  position: number;
}

export default function MyComponent() {
  const {data} = useService()

  const [parent, tapes] = useDragAndDrop<HTMLUListElement, ServiceItem>(data);

  return (
    <ul className="text-white space-y-2" ref={parent}>
      {tapes.map((tape) => (
        <li 
          className="cassette p-4 bg-gray-800 rounded-lg cursor-move hover:bg-gray-700 transition-colors"
          data-label={tape.title}
          key={tape.id}
        >
          <div className="flex items-center gap-4">
            <img 
              src={tape.image} 
              alt={tape.title}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h3 className="font-bold text-lg">{tape.title}</h3>
              <p className="text-gray-300">{tape.description}</p>
              <span className={`text-sm ${tape.isPublish ? 'text-green-400' : 'text-yellow-400'}`}>
                {tape.isPublish ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}