import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../lib/store';
import { motion } from 'motion/react';
import { Home, Users, Plus, LogOut, Loader2, Copy, Check } from 'lucide-react';

export function HouseholdManager() {
  const { user, household, setHousehold } = useStore();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [householdId, setHouseholdId] = useState('');
  const [isJoin, setIsJoin] = useState(false);
  const [copied, setCopied] = useState(false);

  const createHousehold = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('households')
        .insert([{ name, owner_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ household_id: data.id })
        .eq('id', user.id);

      if (profileError) throw profileError;

      setHousehold(data);
    } catch (err) {
      console.error(err);
      alert('Error creating household');
    } finally {
      setLoading(false);
    }
  };

  const joinHousehold = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // First check if household exists
      const { data, error: hError } = await supabase
        .from('households')
        .select()
        .eq('id', householdId)
        .single();

      if (hError) throw new Error('Household not found');

      const { error } = await supabase
        .from('profiles')
        .update({ household_id: householdId })
        .eq('id', user.id);

      if (error) throw error;

      setHousehold(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyId = () => {
    if (!household) return;
    navigator.clipboard.writeText(household.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (household) {
    return (
      <div className="rounded-[32px] bg-green-50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 text-white">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-green-900">{household.name}</h3>
              <p className="text-xs font-medium text-green-600/70">Shared Household</p>
            </div>
          </div>
          <button 
            onClick={() => supabase.auth.signOut()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-400 shadow-sm transition-colors hover:text-red-500"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-green-800/40">Invite ID</p>
          <button 
            onClick={copyId}
            className="flex items-center justify-between rounded-xl bg-white p-3 text-sm font-mono font-medium text-green-900 shadow-sm"
          >
            <span className="truncate pr-4">{household.id}</span>
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-zinc-400" />}
          </button>
          <p className="text-[10px] font-medium text-green-600/60 text-center">Share this ID with family members to join</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] bg-zinc-100 p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
          <Users className="h-5 w-5" />
        </div>
        <h3 className="font-bold">Setup Household</h3>
      </div>

      <div className="flex rounded-xl bg-zinc-200 p-1 mb-6">
        <button
          onClick={() => setIsJoin(false)}
          className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${!isJoin ? 'bg-white shadow-sm' : 'text-zinc-500'}`}
        >
          Create New
        </button>
        <button
          onClick={() => setIsJoin(true)}
          className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${isJoin ? 'bg-white shadow-sm' : 'text-zinc-500'}`}
        >
          Join Existing
        </button>
      </div>

      <div className="space-y-4">
        {isJoin ? (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Paste Household ID"
              value={householdId}
              onChange={(e) => setHouseholdId(e.target.value)}
              className="w-full rounded-xl border-none bg-white p-4 font-medium shadow-sm focus:ring-2 focus:ring-black/5"
            />
            <button
              onClick={joinHousehold}
              disabled={loading || !householdId}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-4 font-bold text-white transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Join Family'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Household Name (e.g. My Family)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border-none bg-white p-4 font-medium shadow-sm focus:ring-2 focus:ring-black/5"
            />
            <button
              onClick={createHousehold}
              disabled={loading || !name}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-4 font-bold text-white transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Household'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
