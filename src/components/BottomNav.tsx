import { Capacitor } from '@capacitor/core';
import { Home, ShoppingCart, Settings, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useStore } from '../lib/store';

export function BottomNav() {
  const { shoppingMode, setShoppingMode } = useStore();
  
  if (!Capacitor.isNativePlatform()) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around border-t border-black/5 bg-white px-6 pb-2 backdrop-blur-md">
      <button 
        onClick={() => setShoppingMode(false)}
        className={cn(
          "flex flex-col items-center gap-1",
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
          "flex flex-col items-center gap-1",
          shoppingMode ? "text-green-600" : "text-black/30"
        )}
      >
        <ShoppingCart className="h-6 w-6" />
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
