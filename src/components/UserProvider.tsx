import React, { createContext, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../lib/store';
import { Profile, Household, GroceryItem } from '../types';

export const UserContext = createContext<{ initialized: boolean }>({ initialized: false });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, household, setUser, setHousehold, setItems, addItem, updateItem, deleteItem } = useStore();
  const [initialized, setInitialized] = React.useState(false);
  const [syncError, setSyncError] = React.useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        if (session) {
          handleAuthChange(session.user.id);
        } else {
          setInitialized(true);
        }
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth Event:', event);
      if (mounted) {
        if (session) {
          handleAuthChange(session.user.id);
        } else {
          useStore.getState().reset();
          setInitialized(true);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthChange = async (userId: string) => {
    try {
      setSyncError(null);
      console.log('Starting sync for user:', userId);
      
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        const isStale = authError.message.includes('User from sub claim') || authError.status === 403;
        const isMissing = authError.message.includes('Auth session missing');

        if (isStale || isMissing) {
          console.warn('Auth session invalid or missing, cleaning up...');
          if (isStale) await supabase.auth.signOut();
          useStore.getState().reset();
          setInitialized(true);
          return;
        }
        
        console.error('Auth User error:', authError);
        if (authError.message.includes('fetch')) {
          setSyncError('Network connection error. Please check your internet and Supabase configuration.');
        }
        setInitialized(true);
        return;
      }

      if (!authUser) {
        console.warn('No auth user found in handleAuthChange');
        setInitialized(true);
        return;
      }

      console.log('Fetching profile for:', userId);
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Fallback: If profile doesn't exist, create it manually
      if (profileError && (profileError.code === 'PGRST116' || profileError.message.includes('No rows'))) {
        console.log('Profile not found, creating fallback profile for UID:', userId);
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: userId, 
            email: authUser.email!, 
            full_name: authUser.user_metadata?.full_name || '' 
          }])
          .select()
          .single();
        
        if (insertError) {
          console.error('Manual profile creation failed:', insertError);
          setUser({ id: userId, email: authUser.email!, full_name: authUser.user_metadata?.full_name });
        } else {
          profile = newProfile;
        }
      } else if (profileError) {
        if (profileError.code === '42P17') {
          setSyncError('Database Policy Error: Infinite recursion detected. Please update your SQL schema.');
        }
        console.error('Error fetching profile:', profileError);
        setUser({ id: userId, email: authUser.email!, full_name: authUser.user_metadata?.full_name });
      }

      if (profile) {
        setUser(profile as Profile);

        if (profile.household_id) {
          const { data: householdData, error: hError } = await supabase
            .from('households')
            .select('*')
            .eq('id', profile.household_id)
            .single();

          if (!hError && householdData) {
            setHousehold(householdData as Household);

            const { data: items, error: iError } = await supabase
              .from('grocery_items')
              .select('*')
              .eq('household_id', profile.household_id)
              .order('created_at', { ascending: false });

            if (!iError && items) {
              setItems(items as GroceryItem[]);
            }
          }
        }
      }
    } catch (err) {
      console.error('Error syncing:', err);
    } finally {
      setInitialized(true);
    }
  };

  // Separate effect for subscription
  useEffect(() => {
    if (!household?.id) return;

    const channel = supabase
      .channel(`household_${household.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'grocery_items',
          filter: `household_id=eq.${household.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // Check if item already exists to avoid duplicates
            const exists = useStore.getState().items.some(i => i.id === payload.new.id);
            if (!exists) addItem(payload.new as GroceryItem);
          } else if (payload.eventType === 'UPDATE') {
            updateItem(payload.new.id, payload.new as Partial<GroceryItem>);
          } else if (payload.eventType === 'DELETE') {
            deleteItem(payload.old.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [household?.id]);

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
          <p className="text-sm font-medium text-zinc-500">Connecting to services...</p>
        </div>
      </div>
    );
  }

  if (syncError) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 p-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-zinc-200/50">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-bold text-zinc-900">Connection Issue</h2>
          <p className="mb-6 text-sm text-zinc-500 leading-relaxed">{syncError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full rounded-2xl bg-green-500 py-4 font-bold text-white transition-all hover:bg-green-600 active:scale-95"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ initialized }}>
      {children}
    </UserContext.Provider>
  );
}
