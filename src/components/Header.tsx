import { ShoppingBag, ShoppingCart, Users } from 'lucide-react';
import React from 'react';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';

export function Header() {
  const { shoppingMode, setShoppingMode, items, household } = useStore();
  const unpurchasedCount = items.filter(i => !i.purchased).length;

  return (
    <header className="sticky top-0 z-30 bg-white/90 px-6 py-4 backdrop-blur-md border-b border-zinc-100">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-default">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900 group-hover:bg-zinc-200 transition-colors">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-zinc-900">ZayList</h1>
                {household && (
                  <div className="flex items-center gap-1 rounded-md bg-zinc-100 px-1.5 py-0.5 border border-zinc-200/50">
                    <Users className="h-3 w-3 text-zinc-400" />
                    <span className="text-[10px] font-semibold text-zinc-500 truncate max-w-[100px]">{household.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShoppingMode(!shoppingMode)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  shoppingMode 
                    ? "bg-blue-50 text-blue-600 border border-blue-100" 
                    : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100 border border-zinc-200"
                )}
              >
                <ShoppingCart className="h-4 w-4" />
                <span>{shoppingMode ? 'Shopping' : 'List'}</span>
                {unpurchasedCount > 0 && (
                  <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white px-1">
                    {unpurchasedCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
