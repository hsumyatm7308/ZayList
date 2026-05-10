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

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  household_id?: string;
}

export interface Household {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  note?: string;
  quantity: string;
  price: number;
  category: Category;
  purchased: boolean;
  user_id: string;
  household_id: string;
  created_at: string;
  purchased_at?: string;
}

export interface AppState {
  user: Profile | null;
  household: Household | null;
  items: GroceryItem[];
  shoppingMode: boolean;
  darkMode: boolean;
  searchQuery: string;
  sortBy: SortOption;
  categoryFilter: Category | 'All';
  
  // Actions
  setUser: (user: Profile | null) => void;
  setHousehold: (household: Household | null) => void;
  setItems: (items: GroceryItem[]) => void;
  addItem: (item: GroceryItem) => void;
  updateItem: (id: string, updates: Partial<GroceryItem>) => void;
  deleteItem: (id: string) => void;
  togglePurchased: (id: string) => void;
  setShoppingMode: (enabled: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: SortOption) => void;
  setCategoryFilter: (category: Category | 'All') => void;
  reset: () => void;
}
