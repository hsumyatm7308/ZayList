import { Capacitor } from '@capacitor/core';
import { Home, ShoppingCart, BarChart2, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useStore } from '../lib/store';

interface BottomNavProps {
  activeTab: 'shopping' | 'insights' | 'settings';
  setActiveTab: (tab: 'shopping' | 'insights' | 'settings') => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const { items } = useStore();
  const unpurchasedCount = items.filter(i => !i.purchased).length;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] flex h-16 items-center justify-around border-t border-zinc-100 bg-white/95 px-6 pb-2 backdrop-blur-xl safe-area-bottom">
      <button 
        onClick={() => setActiveTab('shopping')}
        className={cn(
          "relative flex flex-col items-center gap-1 transition-all active:scale-95",
          activeTab === 'shopping' ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
        )}
      >
        <div className="relative">
          <Home className="h-5 w-5" />
          {activeTab === 'shopping' && (
            <motion.div 
              layoutId="bottom-nav-indicator"
              className="absolute -bottom-2.5 h-0.5 w-4 rounded-full bg-zinc-900"
            />
          )}
        </div>
        <span className="text-[10px] font-bold tracking-tight">Home</span>
      </button>

      <button 
        onClick={() => setActiveTab('insights')}
        className={cn(
          "relative flex flex-col items-center gap-1 transition-all active:scale-95",
          activeTab === 'insights' ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
        )}
      >
        <div className="relative">
          <BarChart2 className="h-5 w-5" />
          {activeTab === 'insights' && (
            <motion.div 
              layoutId="bottom-nav-indicator"
              className="absolute -bottom-2.5 h-0.5 w-4 rounded-full bg-zinc-900"
            />
          )}
        </div>
        <span className="text-[10px] font-bold tracking-tight">Insights</span>
      </button>

      <button 
        onClick={() => setActiveTab('settings')}
        className={cn(
          "relative flex flex-col items-center gap-1 transition-all active:scale-95",
          activeTab === 'settings' ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
        )}
      >
        <div className="relative">
          <Settings className="h-5 w-5" />
          {activeTab === 'settings' && (
            <motion.div 
              layoutId="bottom-nav-indicator"
              className="absolute -bottom-2.5 h-0.5 w-4 rounded-full bg-zinc-900"
            />
          )}
        </div>
        <span className="text-[10px] font-bold tracking-tight">Settings</span>
      </button>

      <div className="w-px h-6 bg-zinc-100 mx-2" />

      <div className="relative flex flex-col items-center gap-1 text-zinc-400">
        <div className="relative">
          <ShoppingCart className="h-5 w-5" />
          {unpurchasedCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-1.5 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white px-1"
            >
              {unpurchasedCount}
            </motion.span>
          )}
        </div>
        <span className="text-[10px] font-bold tracking-tight">List</span>
      </div>
    </nav>
  );
}
