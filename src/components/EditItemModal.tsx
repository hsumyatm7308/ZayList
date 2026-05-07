import { useState, useEffect, FormEvent } from 'react';
import { X, Check, Trash2, ListPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../lib/store';
import { GroceryItem, Category } from '../types';
import { cn } from '../lib/utils';
import { VoiceInput } from './VoiceInput';

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
  const [category, setCategory] = useState<Category>(item.category);
  const { updateItem, deleteItem } = useStore();

  useEffect(() => {
    if (isOpen) {
      setName(item.name);
      setNote(item.note || '');
      setCategory(item.category);
    }
  }, [isOpen, item]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    updateItem(item.id, {
      name: name.trim(),
      note: note.trim(),
      category
    });
    onClose();
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed left-1/2 top-1/2 z-[60] w-[calc(100%-48px)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-[32px] bg-white p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Edit Item</h2>
              <button 
                onClick={onClose}
                className="rounded-full bg-black/5 p-2 text-black/40 hover:text-black"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Item name"
                  className="h-14 w-full border-b-2 border-black/5 pr-12 text-xl font-medium outline-none focus:border-black transition-colors"
                  autoFocus
                />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 scale-75">
                  <VoiceInput onTranscript={handleVoiceTranscript} />
                </div>
              </div>

              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note (optional)"
                className="h-10 w-full border-b border-black/5 text-sm outline-none focus:border-black transition-colors"
              />

              <div className="flex flex-wrap gap-2 py-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all",
                      category === cat 
                        ? "bg-black text-white" 
                        : "bg-black/5 text-black/40 hover:bg-black/10"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    deleteItem(item.id);
                    onClose();
                  }}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-6 w-6" />
                </button>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="flex h-14 flex-grow items-center justify-center gap-2 rounded-2xl bg-black font-bold uppercase tracking-widest text-white shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  <Check className="h-6 w-6" />
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
