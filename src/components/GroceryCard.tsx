import { useState } from 'react';
import { Trash2, Edit3, Circle, CheckCircle2 } from 'lucide-react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { GroceryItem } from '../types';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { EditItemModal } from './EditItemModal';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

interface GroceryCardProps {
  item: GroceryItem;
  isShoppingMode: boolean;
}

export function GroceryCard({ item, isShoppingMode }: GroceryCardProps) {
  const { togglePurchased, deleteItem } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const x = useMotionValue(0);
  
  // Transform x position to background color and opacity for delete indicator
  const opacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);
  const scale = useTransform(x, [-100, -50, 0], [1.2, 1, 0.8]);

  const handleToggle = async () => {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
    togglePurchased(item.id);
  };

  const handleDragEnd = async (_: any, info: any) => {
    if (info.offset.x < -100) {
      if (Capacitor.isNativePlatform()) {
        await Haptics.notification({ type: 'error' as any });
      }
      deleteItem(item.id);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Delete background indicator */}
      <motion.div 
        style={{ opacity }}
        className="absolute inset-y-0 right-0 flex w-24 items-center justify-center bg-red-500 text-white"
      >
        <motion.div style={{ scale }}>
          <Trash2 className="h-6 w-6" />
        </motion.div>
      </motion.div>

      <motion.div
        layout
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        whileHover={!isShoppingMode ? { y: -2 } : {}}
        className={cn(
          "relative flex items-center gap-4 border border-black/5 bg-white p-4 transition-all duration-200",
          item.purchased && !isShoppingMode && "opacity-60 grayscale-[0.5]"
        )}
      >
        <button
          onClick={handleToggle}
          className={cn(
            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300",
            item.purchased 
              ? "bg-green-500 text-white shadow-lg shadow-green-200" 
              : "bg-surface text-surface-dark hover:scale-110 active:scale-95"
          )}
        >
          {item.purchased ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6 opacity-20" />}
        </button>

        <div className="flex-grow overflow-hidden" onClick={() => !isShoppingMode && setIsEditing(true)}>
          <div className="flex items-center gap-2">
            <h3 className={cn(
              "truncate text-lg font-medium transition-all duration-300",
              item.purchased && "text-black/40 line-through decoration-black/30"
            )}>
              {item.name}
            </h3>
            <span className="hidden rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black/40 group-hover:block sm:block">
              {item.category}
            </span>
          </div>
          {item.note && (
            <p className={cn(
              "mt-0.5 truncate text-sm text-black/50 transition-all duration-300",
              item.purchased && "opacity-40"
            )}>
              {item.note}
            </p>
          )}
          <span className="mt-1 block text-[10px] text-black/20 font-medium uppercase tracking-widest">
            {formatDistanceToNow(item.createdAt, { addSuffix: true })}
          </span>
        </div>

        {!isShoppingMode && (
          <div className="hidden items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 sm:flex">
            <button
              onClick={() => setIsEditing(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-blue-500 hover:bg-blue-50 active:scale-90"
            >
              <Edit3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => deleteItem(item.id)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-red-500 hover:bg-red-50 active:scale-90"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        )}
      </motion.div>

      <EditItemModal 
        item={item} 
        isOpen={isEditing} 
        onClose={() => setIsEditing(false)} 
      />
    </div>
  );
}
