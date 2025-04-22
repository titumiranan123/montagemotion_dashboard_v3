'use client'
import React from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  isPublish: boolean;
  position: number;
}

export default function MyComponent() {
  const [parent, tapes] = useDragAndDrop<HTMLUListElement, ServiceItem>([
    {
      id: '1',
      title: "Web Development",
      description: "Custom website development with modern technologies",
      image: "https://example.com/web-dev.jpg",
      isPublish: true,
      position: 1
    },
    {
      id: '2',
      title: "Mobile App Development",
      description: "Build cross-platform mobile applications",
      image: "https://example.com/mobile-app.jpg",
      isPublish: true,
      position: 2
    },
    {
      id: '3',
      title: "UI/UX Design",
      description: "Beautiful and intuitive user interfaces",
      image: "https://example.com/ui-ux.jpg",
      isPublish: true,
      position: 3
    },
    {
      id: '4',
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure services",
      image: "https://example.com/cloud.jpg",
      isPublish: false,
      position: 4
    },
    {
      id: '5',
      title: "SEO Optimization",
      description: "Improve your search engine rankings",
      image: "https://example.com/seo.jpg",
      isPublish: true,
      position: 5
    },
    {
      id: '6',
      title: "Content Marketing",
      description: "Engaging content strategies for your business",
      image: "https://example.com/content.jpg",
      isPublish: true,
      position: 6
    },
    {
      id: '7',
      title: "Social Media Management",
      description: "Grow your social media presence",
      image: "https://example.com/social.jpg",
      isPublish: false,
      position: 7
    },
    {
      id: '8',
      title: "E-commerce Solutions",
      description: "Build your online store with our platform",
      image: "https://example.com/ecommerce.jpg",
      isPublish: true,
      position: 8
    },
    {
      id: '9',
      title: "Data Analytics",
      description: "Turn your data into actionable insights",
      image: "https://example.com/analytics.jpg",
      isPublish: true,
      position: 9
    },
    {
      id: '10',
      title: "Cyber Security",
      description: "Protect your business from online threats",
      image: "https://example.com/security.jpg",
      isPublish: true,
      position: 10
    }
  ]);

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