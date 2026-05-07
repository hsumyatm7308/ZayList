import { useState } from 'react';
import { Check, Trash2, Edit3, Circle, CheckCircle2, ChevronRight, Hash } from 'lucide-react';
import { motion } from 'motion/react';
import { GroceryItem } from '../types';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { EditItemModal } from './EditItemModal';

interface GroceryCardProps {
  item: GroceryItem;
  isShoppingMode: boolean;
}

export function GroceryCard({ item, isShoppingMode }: GroceryCardProps) {
  const { togglePurchased, deleteItem } = useStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleToggle = () => {
    togglePurchased(item.id);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        whileHover={{ y: -2 }}
        className={cn(
          "group relative flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 transition-all duration-200",
          "hover:shadow-lg hover:shadow-black/5",
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
            <span className="hidden rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black/40 group-hover:block">
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
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
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
    </>
  );
}
