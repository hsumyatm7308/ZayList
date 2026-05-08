import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { useStore } from '../lib/store';
import { Category, SortOption } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const CATEGORIES: (Category | 'All')[] = [
  'All', 'Food', 'Drinks', 'Snacks', 'Household', 'Bathroom', 'Kitchen', 'Medicine', 'Others'
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Recent' }
];

export function FilterSection() {
  const { 
    searchQuery, setSearchQuery, 
    sortBy, setSortBy, 
    categoryFilter, setCategoryFilter 
  } = useStore();

  return (
    <div className="space-y-6 px-6 pb-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black/20" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your list..."
          className="h-14 w-full rounded-2xl bg-black/5 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 focus:ring-black/5"
        />
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
        <div className="flex items-center gap-2 pr-4 border-r border-black/10">
          <ArrowUpDown className="h-4 w-4 text-black/30" />
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all",
                sortBy === opt.value ? "bg-black text-white" : "text-black/40 hover:bg-black/5"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 pl-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all",
                categoryFilter === cat ? "bg-black/80 text-white" : "bg-black/5 text-black/40 hover:bg-black/10"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
