import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import { AppState, GroceryItem, Category, SortOption } from '../types';

// Custom storage for IndexedDB persistence
const storage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export const useStore = create<AppState>()((set) => ({
  user: null,
  household: null,
  items: [],
  shoppingMode: false,
  darkMode: true,
  searchQuery: '',
  sortBy: 'newest',
  categoryFilter: 'All',

  setUser: (user) => set({ user }),
  setHousehold: (household) => set({ household }),
  setItems: (items) => set({ items }),

  addItem: (item) => 
    set((state) => ({
      items: [item, ...state.items],
    })),

  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),

  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  togglePurchased: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id 
          ? { 
              ...item, 
              purchased: !item.purchased,
              purchased_at: !item.purchased ? new Date().toISOString() : undefined
            } 
          : item
      ),
    })),

  setShoppingMode: (enabled) => set({ shoppingMode: enabled }),
  setDarkMode: (enabled) => set({ darkMode: enabled }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  
  reset: () => set({ 
    user: null, 
    household: null, 
    items: [], 
    shoppingMode: false,
    searchQuery: '',
    categoryFilter: 'All'
  }),
}));
