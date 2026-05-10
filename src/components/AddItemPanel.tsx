import { useState, useRef, useEffect, FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../lib/store';
import { VoiceInput } from './VoiceInput';
import { Category } from '../types';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

const CATEGORIES: Category[] = [
  'Food', 'Drinks', 'Snacks', 'Household', 'Bathroom', 'Kitchen', 'Medicine', 'Others'
];

export function AddItemPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category>('Others');
  const [loading, setLoading] = useState(false);
  
  const { user, household, addItem } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!name.trim() || !user || !household) return;
    
    setLoading(true);
    try {
      const itemNames = name.split(/[,\n]/).map(n => n.trim()).filter(n => n !== "");
      
      const newItems = itemNames.map(itemName => ({
        name: itemName,
        note: note.trim(),
        quantity: quantity || '1',
        price: parseFloat(price) || 0,
        category,
        user_id: user.id,
        household_id: household.id,
        purchased: false
      }));

      const { data, error } = await supabase
        .from('grocery_items')
        .insert(newItems)
        .select();

      if (error) throw error;
      
      // Update local store (optional since realtime listener will also pick it up, 
      // but doing it here makes it feel faster)
      // Actually UserProvider handles it via subscription.

      setName('');
      setNote('');
      setQuantity('1');
      setPrice('');
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error saving item');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceTranscript = (text: string) => {
    setName(text);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-white shadow-xl active:bg-black"
      >
        <Plus className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[150] bg-zinc-900/40 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-[200] max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white p-6 pb-12 shadow-2xl safe-area-bottom"
            >
              <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-zinc-200" />
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Item Name */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight text-zinc-900">New Item</h2>
                    <VoiceInput onTranscript={handleVoiceTranscript} />
                  </div>
                  
                  <div className="relative group">
                    <input
                      ref={inputRef}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="What do we need?"
                      className="w-full bg-transparent text-lg font-medium outline-none placeholder:text-zinc-300 pb-2 border-b border-zinc-100 focus:border-zinc-300 transition-colors"
                    />
                  </div>
                </div>

                {/* Optional Note */}
                <div className="relative group">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Note</span>
                  </div>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add more details..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-300 pb-1 border-b border-zinc-50 focus:border-zinc-200 transition-colors"
                  />
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Price (Ks)</span>
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
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Quantity</span>
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="1"
                      className="w-full bg-transparent text-sm font-semibold outline-none pb-1 border-b border-zinc-50 focus:border-zinc-200 transition-colors"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Category</span>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={cn(
                          "rounded-md px-3 py-1 text-[11px] font-medium transition-all border",
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

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 h-12 rounded-lg bg-zinc-50 text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-all active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!name.trim() || loading}
                    className="flex-[2] h-12 rounded-lg bg-zinc-900 text-sm font-bold text-white hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Add to List'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
