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

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      items: [],
      shoppingMode: false,
      darkMode: true,
      searchQuery: '',
      sortBy: 'newest',
      categoryFilter: 'All',

      addItem: (name, note, category = 'Others') => 
        set((state) => ({
          items: [
            {
              id: crypto.randomUUID(),
              name,
              note,
              category,
              purchased: false,
              createdAt: Date.now(),
            },
            ...state.items,
          ],
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
            item.id === id ? { ...item, purchased: !item.purchased } : item
          ),
        })),

      clearPurchased: () =>
        set((state) => ({
          items: state.items.filter((item) => !item.purchased),
        })),

      clearAllItems: () =>
        set({ items: [] }),

      setShoppingMode: (enabled) => set({ shoppingMode: enabled }),
      setDarkMode: (enabled) => set({ darkMode: enabled }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSortBy: (sort) => set({ sortBy: sort }),
      setCategoryFilter: (category) => set({ categoryFilter: category }),
    }),
    {
      name: 'zaylist-storage',
      storage: createJSONStorage(() => storage as any),
    }
  )
);
