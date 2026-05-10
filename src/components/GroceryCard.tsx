import { useState } from 'react';
import { Trash2, Edit3, Circle, CheckCircle2, User, AlertCircle } from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { GroceryItem } from '../types';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { EditItemModal } from './EditItemModal';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import { supabase } from '../lib/supabase';

interface GroceryCardProps {
  item: GroceryItem;
  isShoppingMode: boolean;
}

export function GroceryCard({ item, isShoppingMode }: GroceryCardProps) {
  const { user } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const x = useMotionValue(0);
  
  const opacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);
  const scale = useTransform(x, [-100, -50, 0], [1.2, 1, 0.8]);

  const handleToggle = async () => {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
    
    try {
      const { error } = await supabase
        .from('grocery_items')
        .update({ 
          purchased: !item.purchased,
          purchased_at: !item.purchased ? new Date().toISOString() : null
        })
        .eq('id', item.id);

      if (error) throw error;
    } catch (err) {
      console.error(err);
      alert('Error updating item');
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('grocery_items')
        .delete()
        .eq('id', item.id);
      if (error) throw error;
    } catch (err) {
      console.error(err);
      alert('Error deleting item');
    }
  };

  const handleDragEnd = async (_: any, info: any) => {
    if (info.offset.x < -100) {
      if (Capacitor.isNativePlatform()) {
        await Haptics.notification({ type: 'error' as any });
      }
      handleDelete();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl">
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
        className={cn(
          "group relative flex items-center gap-3 border-b border-zinc-100 bg-white px-6 py-4 transition-all duration-200",
          item.purchased && !isShoppingMode && "bg-zinc-50/50"
        )}
      >
        <button
          onClick={handleToggle}
          className={cn(
            "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition-all duration-300",
            item.purchased 
              ? "bg-blue-600 border-blue-600 text-white" 
              : "bg-white border-zinc-300 hover:border-zinc-400"
          )}
        >
          {item.purchased && <CheckCircle2 className="h-3.5 w-3.5" />}
        </button>

        <div className="flex-grow overflow-hidden flex flex-col gap-0.5" onClick={() => !isShoppingMode && setIsEditing(true)}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <h3 className={cn(
                "truncate text-sm font-medium transition-all duration-500",
                item.purchased ? "text-zinc-400 line-through" : "text-zinc-900"
              )}>
                {item.name}
              </h3>
              <span className={cn(
                "shrink-0 text-[10px] font-medium text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-100/50",
                item.purchased && "opacity-50"
              )}>
                {item.category}
              </span>
            </div>
            {item.price > 0 ? (
              <span className={cn(
                "shrink-0 text-sm font-semibold tabular-nums transition-colors",
                item.purchased ? "text-zinc-300" : "text-zinc-900"
              )}>
                {(item.price * (parseFloat(item.quantity) || 1)).toLocaleString()} Ks
              </span>
            ) : item.purchased && (
              <span className="shrink-0 text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Missing price
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-[11px] font-bold text-zinc-400",
              item.purchased && "opacity-50"
            )}>
              {item.quantity} {parseFloat(item.quantity) === 1 ? 'UNIT' : 'UNITS'}
            </span>
            {item.note && (
              <>
                <span className="text-zinc-200">/</span>
                <p className={cn(
                  "truncate text-[11px] transition-all duration-500",
                  item.purchased ? "text-zinc-300" : "text-zinc-500"
                )}>
                  {item.note}
                </p>
              </>
            )}
          </div>
        </div>

        {!isShoppingMode && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-zinc-100 text-zinc-400"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-red-50 text-red-400"
            >
              <Trash2 className="h-4 w-4" />
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
