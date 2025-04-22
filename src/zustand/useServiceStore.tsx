// store/useItemStore.ts
import { create } from "zustand";

interface Item {
  id: number;
  name: string;
}

interface ItemState {
  items: Item[];
  setItems: (items: Item[]) => void;
}

export const useItemStore = create<ItemState>((set) => ({
  items: [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" },
    { id: 4, name: "Item 4" },
  ],
  setItems: (items) => set({ items }),
}));
