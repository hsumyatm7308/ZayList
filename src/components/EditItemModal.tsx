import { useState, useEffect, FormEvent } from 'react';
import { X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../lib/store';
import { GroceryItem, Category } from '../types';
import { cn } from '../lib/utils';
import { VoiceInput } from './VoiceInput';
import { supabase } from '../lib/supabase';

const CATEGORIES: Category[] = [
  'Food', 'Drinks', 'Snacks', 'Household', 'Bathroom', 'Kitchen', 'Medicine', 'Others'
];

interface EditItemModalProps {
  item: GroceryItem;
  isOpen: boolean;
  onClose: () => void;
}

export function EditItemModal({ item, isOpen, onClose }: EditItemModalProps) {
  const [name, setName] = useState(item.name);
  const [note, setNote] = useState(item.note || '');
  const [quantity, setQuantity] = useState(item.quantity || '1');
  const [price, setPrice] = useState(item.price?.toString() || '');
  const [category, setCategory] = useState<Category>(item.category);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(item.name);
      setNote(item.note || '');
      setQuantity(item.quantity || '1');
      setPrice(item.price?.toString() || '');
      setCategory(item.category);
    }
  }, [isOpen, item]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('grocery_items')
        .update({
          name: name.trim(),
          note: note.trim(),
          quantity: quantity || '1',
          price: parseFloat(price) || 0,
          category,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error updating item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('grocery_items')
        .delete()
        .eq('id', item.id);
      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error deleting item');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceTranscript = (text: string) => {
    setName(text);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="fixed left-1/2 top-1/2 z-[300] w-[calc(100%-48px)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">Edit Item</h2>
              <button 
                onClick={onClose}
                className="rounded-md hover:bg-zinc-100 p-1.5 text-zinc-400 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-1">Name</span>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Item name"
                    className="w-full bg-transparent text-lg font-semibold text-zinc-900 outline-none border-b border-zinc-100 focus:border-zinc-300 pb-1.5 transition-colors"
                    autoFocus
                  />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 scale-90">
                    <VoiceInput onTranscript={handleVoiceTranscript} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-1">Price (Ks)</span>
                  <div className="relative">
                    <input
                      type="number"
                      step="1"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0"
                      className="w-full bg-transparent text-sm font-semibold outline-none pb-1 border-b border-zinc-50 focus:border-zinc-200 transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-1">Quantity</span>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="1"
                    className="w-full bg-transparent text-sm font-semibold outline-none pb-1 border-b border-zinc-50 focus:border-zinc-200 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-1">Note</span>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional details..."
                  className="w-full bg-transparent text-sm outline-none pb-1 border-b border-zinc-50 focus:border-zinc-200 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-1">Category</span>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={cn(
                        "rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all border",
                        category === cat 
                          ? "bg-zinc-100 text-zinc-900 border-zinc-300" 
                          : "bg-transparent border-transparent text-zinc-500 hover:bg-zinc-50"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-12 h-12 flex items-center justify-center rounded-lg bg-zinc-50 text-red-400 hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex-1 flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 h-12 rounded-lg bg-zinc-50 text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-all active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!name.trim() || loading}
                    className="flex-1 h-12 rounded-lg bg-zinc-900 text-sm font-bold text-white hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
