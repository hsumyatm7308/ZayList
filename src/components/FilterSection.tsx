import { Search, Filter, ArrowUpDown, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { useStore } from '../lib/store';
import { Category, SortOption } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import React, { useRef, useState } from 'react';

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showRightGradient, setShowRightGradient] = useState(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const canScrollRight = target.scrollWidth > target.clientWidth + target.scrollLeft + 10;
    setShowRightGradient(canScrollRight);
  };

  return (
    <div className="space-y-4 px-6 pb-4 pt-2">
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-zinc-600 transition-colors" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search items..."
          className="h-10 w-full rounded-md bg-zinc-100/50 pl-10 pr-4 text-sm font-medium outline-none transition-all placeholder:text-zinc-400 focus:bg-white focus:ring-1 focus:ring-zinc-200"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-md hover:bg-zinc-100 text-zinc-400"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <div className="relative">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar"
        >
          <div className="flex items-center gap-1 pr-2 border-r border-zinc-100">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={cn(
                  "whitespace-nowrap px-2 py-1 text-[10px] font-bold transition-all rounded-md",
                  sortBy === opt.value ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-100"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 pl-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  "whitespace-nowrap rounded-md px-3 py-1 text-[11px] font-medium transition-all border",
                  categoryFilter === cat 
                    ? "bg-zinc-100 text-zinc-900 border-zinc-300" 
                    : "bg-transparent border-transparent text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        {showRightGradient && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white to-transparent" />
        )}
      </div>
    </div>
  );
}
