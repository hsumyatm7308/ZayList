import { Capacitor } from '@capacitor/core';
import { Home, ShoppingCart, Settings, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useStore } from '../lib/store';

export function BottomNav() {
  const { shoppingMode, setShoppingMode, items } = useStore();
  const unpurchasedCount = items.filter(i => !i.purchased).length;
  
  if (!Capacitor.isNativePlatform()) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] flex h-20 items-center justify-around border-t border-black/5 bg-white px-6 pb-2 backdrop-blur-md safe-area-bottom">
      <button 
        onClick={() => setShoppingMode(false)}
        className={cn(
          "relative flex flex-col items-center gap-1",
          !shoppingMode ? "text-black" : "text-black/30"
        )}
      >
        <Home className="h-6 w-6" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
        {!shoppingMode && (
          <motion.div 
            layoutId="bottom-nav-indicator"
            className="h-1 w-4 rounded-full bg-black mt-0.5"
          />
        )}
      </button>

      <button 
        onClick={() => setShoppingMode(true)}
        className={cn(
          "relative flex flex-col items-center gap-1",
          shoppingMode ? "text-green-600" : "text-black/30"
        )}
      >
        <div className="relative">
          <ShoppingCart className="h-6 w-6" />
          {unpurchasedCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-black text-white"
            >
              {unpurchasedCount}
            </motion.span>
          )}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider">Shop</span>
        {shoppingMode && (
          <motion.div 
            layoutId="bottom-nav-indicator"
            className="h-1 w-4 rounded-full bg-green-600 mt-0.5"
          />
        )}
      </button>
    </nav>
  );
}
