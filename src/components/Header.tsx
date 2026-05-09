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
            <div className="mt-1 flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Remaining</p>
                <p className={cn(
                  "text-lg font-black leading-none",
                  unpurchasedCount > 0 ? "text-red-500" : "text-black/20"
                )}>
                  {unpurchasedCount} {unpurchasedCount === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button
                onClick={() => setShoppingMode(!shoppingMode)}
                className={cn(
                  "relative flex h-12 w-12 items-center justify-center transition-all duration-300 rounded-full",
                  shoppingMode 
                    ? "bg-green-500 text-white shadow-lg shadow-green-200" 
                    : "bg-black/5 text-black hover:bg-black/10"
                )}
              >
                <ShoppingCart className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
