import { useState, useRef, useEffect, FormEvent } from 'react';
import { Plus, X, Search, Hash, ChevronDown, ListPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../lib/store';
import { VoiceInput } from './VoiceInput';
import { Category } from '../types';
import { cn } from '../lib/utils';

const CATEGORIES: Category[] = [
  'Food', 'Drinks', 'Snacks', 'Household', 'Bathroom', 'Kitchen', 'Medicine', 'Others'
];

export function AddItemPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<Category>('Others');
  const [showCategories, setShowCategories] = useState(false);
  
  const { addItem } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!name.trim()) return;
    
    // Support multi-item add separated by commas or newlines
    const itemNames = name.split(/[,\n]/).map(n => n.trim()).filter(n => n !== "");
    
    itemNames.forEach(itemName => {
      addItem(itemName, note.trim(), category);
    });

    setName('');
    setNote('');
    setIsOpen(false);
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
        className="fixed bottom-24 right-6 z-[90] flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] active:bg-zinc-800"
      >
        <Plus className="h-8 w-8" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-[200] max-h-[90vh] overflow-y-auto rounded-t-[40px] bg-white p-8 pb-12 shadow-[0_-15px_50px_rgba(0,0,0,0.15)] safe-area-bottom"
            >
              <div className="mx-auto mb-8 h-1.5 w-16 rounded-full bg-black/10" />
              
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Add Item</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-black/5 p-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5">
                      <ListPlus className="h-6 w-6 opacity-40" />
                    </div>
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Eggs, Milk, Bread..."
                    className="h-16 w-full border-b-2 border-black/5 pl-16 text-xl font-medium outline-none focus:border-black transition-colors"
                  />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    <VoiceInput onTranscript={handleVoiceTranscript} />
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a simple note (optional)"
                    className="h-12 w-full border-b border-black/5 text-sm outline-none focus:border-black transition-colors"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={cn(
                        "rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all",
                        category === cat 
                          ? "bg-black text-white shadow-lg shadow-black/20" 
                          : "bg-black/5 text-black/40 hover:bg-black/10"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="h-16 w-full rounded-2xl bg-black font-bold uppercase tracking-widest text-white shadow-xl shadow-black/20 active:scale-[0.98] disabled:opacity-50"
                >
                  Save to List
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
