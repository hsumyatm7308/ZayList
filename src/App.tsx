import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { FilterSection } from './components/FilterSection';
import { GroceryCard } from './components/GroceryCard';
import { AddItemPanel } from './components/AddItemPanel';
import { ConfirmationModal } from './components/ConfirmationModal';
import { BottomNav } from './components/BottomNav';
import { useStore } from './lib/store';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, CheckCircle, PackageSearch, Trash2 } from 'lucide-react';
import { cn } from './lib/utils';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export default function App() {
  const { items, searchQuery, sortBy, categoryFilter, shoppingMode, clearAllItems, clearPurchased } = useStore();
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const handleClearAll = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear everything?',
      message: 'This will remove all items from your list. This action cannot be undone.',
      onConfirm: clearAllItems,
    });
  };

  const handleClearPurchased = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear checked?',
      message: 'Remove all items you have already purchased from the list?',
      onConfirm: clearPurchased,
    });
  };

  const filteredItems = useMemo(() => {
    let result = [...items];

    // Filter by search
    if (searchQuery) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.note?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'All') {
      result = result.filter(item => item.category === categoryFilter);
    }

    // Filter for shopping mode
    if (shoppingMode) {
      result = result.filter(item => !item.purchased);
    }

    // Sort
    result.sort((a, b) => {
      // Always put purchased items at the bottom
      if (a.purchased !== b.purchased) {
        return a.purchased ? 1 : -1;
      }
      
      if (sortBy === 'newest') return b.createdAt - a.createdAt;
      return 0;
    });

    return result;
  }, [items, searchQuery, sortBy, categoryFilter, shoppingMode]);

  const purchasedCount = items.filter(i => i.purchased).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? (purchasedCount / totalCount) * 100 : 0;

  useEffect(() => {
    const setupNotifications = async () => {
      if (Capacitor.getPlatform() !== 'web') {
        const permission = await LocalNotifications.requestPermissions();
        if (permission.display === 'granted') {
          // Schedule a weekly reminder if the list isn't empty
          if (items.length > 0) {
            await LocalNotifications.schedule({
              notifications: [
                {
                  title: "Grocery Reminder 🛒",
                  body: `You have ${items.length} items on your list. Time to shop!`,
                  id: 1,
                  schedule: { at: new Date(Date.now() + 1000 * 60 * 60 * 24) }, // Next 24h
                  sound: 'default'
                }
              ]
            });
          }
        }
      } else if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }
    };

    setupNotifications();
  }, [items.length]);

  const isNative = Capacitor.isNativePlatform();

  return (
    <div className={cn(
      "min-h-screen bg-surface selection:bg-black selection:text-white",
      isNative && "pb-20" // Extra padding for bottom nav
    )}>
      <div className={cn(
        "mx-auto max-w-lg bg-white min-h-screen shadow-2xl shadow-black/5 relative pb-32",
        isNative && "pb-40"
      )}>
        <Header />
        
        {!shoppingMode && <FilterSection />}

        <main className="px-6 space-y-4">
          {/* Progress Bar (only when not in shopping mode) */}
          {!shoppingMode && totalCount > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">
                  Your Progress
                </span>
                <span className="text-[10px] font-bold text-black/60">
                  {purchasedCount} / {totalCount} items
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-black/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-black transition-all"
                />
              </div>

              <div className="mt-4 flex flex-wrap justify-end gap-2">
                {purchasedCount > 0 && (
                  <button
                    onClick={handleClearPurchased}
                    className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-green-600 hover:bg-green-100 transition-all active:scale-95"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Clear Checked
                  </button>
                )}
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-100 transition-all active:scale-95"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Heading for Shopping Mode */}
          {shoppingMode && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="py-4"
            >
              <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                <ShoppingCart className="h-8 w-8 text-green-500" />
                Shopping List
              </h2>
              <p className="mt-1 text-sm font-medium text-black/40">
                Tap items to cross them off. Happy shopping!
              </p>
            </motion.div>
          )}

          <div className="space-y-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredItems.map((item) => (
                <div key={item.id}>
                  <GroceryCard 
                    item={item} 
                    isShoppingMode={shoppingMode} 
                  />
                </div>
              ))}
            </AnimatePresence>

            {filteredItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-black/5 text-black/10">
                  {shoppingMode ? <CheckCircle className="h-10 w-10" /> : <PackageSearch className="h-10 w-10" />}
                </div>
                <h3 className="text-xl font-bold tracking-tight">
                  {shoppingMode ? "All done!" : "List is empty"}
                </h3>
                <p className="mt-1 text-sm font-medium text-black/30">
                  {shoppingMode 
                    ? "You've picked up everything from this list." 
                    : "Add items or adjust filters to see results."}
                </p>
              </motion.div>
            )}
          </div>
        </main>

        {!shoppingMode && <AddItemPanel />}

        <BottomNav />

        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
        />
      </div>
    </div>
  );
}
