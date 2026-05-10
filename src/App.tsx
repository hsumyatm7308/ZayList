import { useEffect, useMemo, useState, useContext } from 'react';
import { Header } from './components/Header';
import { FilterSection } from './components/FilterSection';
import { GroceryCard } from './components/GroceryCard';
import { AddItemPanel } from './components/AddItemPanel';
import { ConfirmationModal } from './components/ConfirmationModal';
import { BottomNav } from './components/BottomNav';
import { useStore } from './lib/store';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, CheckCircle, PackageSearch, Trash2, AlertCircle } from 'lucide-react';
import { cn } from './lib/utils';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

import { UserProvider, UserContext } from './components/UserProvider';
import { AuthForm } from './components/auth/AuthForm';
import { HouseholdManager } from './components/auth/HouseholdManager';
import { Insights } from './components/Insights';
import { SettingsView } from './components/SettingsView';

function AppContent() {
  const { user, household, items, searchQuery, sortBy, categoryFilter, shoppingMode } = useStore();
  const { initialized } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState<'shopping' | 'insights' | 'settings'>('shopping');

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <ShoppingCart className="h-10 w-10 text-zinc-100" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  if (!household) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <HouseholdManager />
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen bg-zinc-50 selection:bg-blue-50 selection:text-blue-900",
      Capacitor.isNativePlatform() && "pb-20"
    )}>
      <div className={cn(
        "mx-auto max-w-lg bg-white min-h-screen shadow-sm relative pb-32 border-x border-zinc-100",
        Capacitor.isNativePlatform() && "pb-40"
      )}>
        <Header />
        
        {activeTab === 'shopping' ? (
          <>
            {!shoppingMode && <FilterSection />}

            <main className="space-y-4">
              <GroceryList />
            </main>

            {!shoppingMode && <AddItemPanel />}
          </>
        ) : activeTab === 'insights' ? (
          <main className="px-6 py-6">
            <Insights />
          </main>
        ) : (
          <main className="py-2">
            <SettingsView />
          </main>
        )}

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

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

function GroceryList() {
  const { items, searchQuery, sortBy, categoryFilter, shoppingMode } = useStore();
  
  const filteredItems = useMemo(() => {
    let result = [...items];
    if (searchQuery) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.note?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (categoryFilter !== 'All') {
      result = result.filter(item => item.category === categoryFilter);
    }
    if (shoppingMode) {
      result = result.filter(item => !item.purchased);
    } else {
      // Auto-clear logic: hide purchased & priced items after 24h
      // But keep unpriced purchased items so user can input price
      result = result.filter(item => {
        if (!item.purchased) return true;
        if (item.price === 0) return true; 
        if (!item.purchased_at) return true;
        
        const purchaseDate = new Date(item.purchased_at);
        const now = new Date();
        const diffInHours = (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60);
        return diffInHours < 24;
      });
    }
    result.sort((a, b) => {
      if (a.purchased !== b.purchased) return a.purchased ? 1 : -1;
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0;
    });
    return result;
  }, [items, searchQuery, sortBy, categoryFilter, shoppingMode]);

  return (
    <div className="flex flex-col">
      {shoppingMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-blue-500" />
              <h2 className="text-sm font-bold text-zinc-900 tracking-tight">Shopping Mode</h2>
            </div>
            {filteredItems.some(i => i.purchased && i.price === 0) && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-50 border border-red-100 animate-pulse">
                <AlertCircle className="h-3 w-3 text-red-500" />
                <span className="text-[10px] font-bold text-red-600">UNPRICED ITEMS</span>
              </div>
            )}
          </div>
          <p className="mt-1 text-[11px] font-medium text-zinc-400">
            Checking off items you've found.
          </p>
        </motion.div>
      )}

      <AnimatePresence mode="popLayout" initial={false}>
        {filteredItems.map((item) => (
          <div key={item.id}>
            <GroceryCard item={item} isShoppingMode={shoppingMode} />
          </div>
        ))}
      </AnimatePresence>

      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-32 text-center px-6"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-50 text-zinc-200">
            {shoppingMode ? <CheckCircle className="h-6 w-6" /> : <PackageSearch className="h-6 w-6" />}
          </div>
          <h3 className="text-sm font-bold text-zinc-900">
            {shoppingMode ? "All caught up" : "Empty workspace"}
          </h3>
          <p className="mt-1 text-xs text-zinc-400 leading-relaxed max-w-[200px]">
            {shoppingMode 
              ? "Everything has been cross off. Good job!" 
              : "No items found. Start by adding something to the list."}
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
