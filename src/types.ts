export type Category = 
  | 'Food' 
  | 'Drinks' 
  | 'Snacks' 
  | 'Household' 
  | 'Bathroom' 
  | 'Kitchen' 
  | 'Medicine' 
  | 'Others';

export type SortOption = 'newest';

export interface GroceryItem {
  id: string;
  name: string;
  note?: string;
  purchased: boolean;
  category: Category;
  createdAt: number;
}

export interface AppState {
  items: GroceryItem[];
  shoppingMode: boolean;
  darkMode: boolean;
  searchQuery: string;
  sortBy: SortOption;
  categoryFilter: Category | 'All';
  
  // Actions
  addItem: (name: string, note?: string, category?: Category) => void;
  updateItem: (id: string, updates: Partial<GroceryItem>) => void;
  deleteItem: (id: string) => void;
  togglePurchased: (id: string) => void;
  clearPurchased: () => void;
  clearAllItems: () => void;
  setShoppingMode: (enabled: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: SortOption) => void;
  setCategoryFilter: (category: Category | 'All') => void;
}
