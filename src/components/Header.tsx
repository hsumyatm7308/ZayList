import { ShoppingBag, Sparkles, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';

export function Header() {
  const { shoppingMode, setShoppingMode, items } = useStore();
  const unpurchasedCount = items.filter(i => !i.purchased).length;

  return (
    <header className="sticky top-0 z-30 bg-white/80 px-6 py-6 backdrop-blur-md">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">ZayList</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30">
                Grocery Hub
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-wider text-black/40">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
            <div className="mt-1 flex items-center gap-2">
              <button
                onClick={() => setShoppingMode(!shoppingMode)}
                className={cn(
                  "relative flex h-12 items-center justify-center transition-all duration-300",
                  shoppingMode 
                    ? "w-12 rounded-full bg-green-500 text-white shadow-lg shadow-green-200" 
                    : "gap-3 rounded-2xl bg-black/5 px-5 text-black hover:bg-black/10"
                )}
              >
                {shoppingMode ? (
                  <>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      <ShoppingCart className="h-6 w-6" />

                    </span>
                  </>
                ) :(
                  <ShoppingCart className="h-6 w-6" />
                )}
                {unpurchasedCount > 0 && !shoppingMode && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white shadow-lg shadow-red-200">
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
