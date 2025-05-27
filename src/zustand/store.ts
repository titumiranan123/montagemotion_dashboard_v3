// store.ts
import { create } from 'zustand';

interface Item {
  id: string;
  title: string;
  description: string;
  image: string;
  isPublish: boolean;
  position: number;
}

interface ItemsStore {
  items: Item[];
  draggedItem: Item | null;
  setDraggedItem: (item: Item | null) => void;
  moveItem: (draggedId: number, targetPosition: number) => void;
}

const initialItems: Item[] = [
  {
    id:' 1',
    title: "Web Development",
    description: "Custom website development with modern technologies",
    image: "https://example.com/web-dev.jpg",
    isPublish: true,
    position: 1
  },
  {
    id:' 2',
    title: "Mobile App Development",
    description: "Build cross-platform mobile applications",
    image: "https://example.com/mobile-app.jpg",
    isPublish: true,
    position: 2
  },
  {
    id:' 3',
    title: "UI/UX Design",
    description: "Beautiful and intuitive user interfaces",
    image: "https://example.com/ui-ux.jpg",
    isPublish: true,
    position: 3
  },
  {
    id:' 4',
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure services",
    image: "https://example.com/cloud.jpg",
    isPublish: false,
    position: 4
  },
  {
    id:' 5',
    title: "SEO Optimization",
    description: "Improve your search engine rankings",
    image: "https://example.com/seo.jpg",
    isPublish: true,
    position: 5
  },
  {
    id:' 6',
    title: "Content Marketing",
    description: "Engaging content strategies for your business",
    image: "https://example.com/content.jpg",
    isPublish: true,
    position: 6
  },
  {
    id:' 7',
    title: "Social Media Management",
    description: "Grow your social media presence",
    image: "https://example.com/social.jpg",
    isPublish: false,
    position: 7
  },
  {
    id:' 8',
    title: "E-commerce Solutions",
    description: "Build your online store with our platform",
    image: "https://example.com/ecommerce.jpg",
    isPublish: true,
    position: 8
  },
  {
    id:' 9',
    title: "Data Analytics",
    description: "Turn your data into actionable insights",
    image: "https://example.com/analytics.jpg",
    isPublish: true,
    position: 9
  },
  {
    id:' 10',
    title: "Cyber Security",
    description: "Protect your business from online threats",
    image: "https://example.com/security.jpg",
    isPublish: true,
    position: 10
  }
];

const useItemsStore = create<ItemsStore>((set) => ({
  items: initialItems,
  draggedItem: null,
  
  setDraggedItem: (item) => {
    set({ draggedItem: item });
  },
  
  moveItem: (draggedId, targetPosition) => 
    set((state) => {
      const items = [...state.items];
      const draggedIndex = items.findIndex(item => item.position === draggedId);
      
      if (draggedIndex === -1) {
        return {};
      }
      
      const draggedItem = items[draggedIndex];
      
      // Remove from old position
      items.splice(draggedIndex, 1);
      
      // Find new index based on target position
      let newIndex = items.findIndex(item => item.position >= targetPosition);
      if (newIndex === -1) newIndex = items.length;
      
      // Insert at new position
      items.splice(newIndex, 0, draggedItem);
      
      // Update positions based on new order
      const updatedItems = items.map((item, index) => ({
        ...item,
        position: index + 1
      }));
      return { items: updatedItems };
    }),
}));

export default useItemsStore;