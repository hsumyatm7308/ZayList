import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, User, Home, LogOut, Copy, Check, ShieldCheck } from 'lucide-react';
import { useStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

export function SettingsView() {
  const { user, household, setUser, setHousehold } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState(user?.full_name || '');
  const [householdName, setHouseholdName] = useState(household?.name || '');
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopyId = () => {
    if (household?.id) {
      navigator.clipboard.writeText(household.id);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setHousehold(null);
  };

  const handleSave = async () => {
    if (!user || !household) return;
    setLoading(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: profileName })
        .eq('id', user.id);

      if (profileError) throw profileError;

      if (household.owner_id === user.id) {
        const { error: householdError } = await supabase
          .from('households')
          .update({ name: householdName })
          .eq('id', household.id);
        
        if (householdError) throw householdError;
      }

      setUser({ ...user, full_name: profileName });
      setHousehold({ ...household, name: householdName });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-32 px-6"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900 border border-zinc-200/50">
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Settings</h2>
          <p className="text-xs text-zinc-400">Manage your profile and workspace</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-zinc-900 px-1">
            <User className="h-4 w-4 text-zinc-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Profile</h3>
          </div>
          <div className="rounded-xl border border-zinc-100 bg-white p-6">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Full Name</p>
              {isEditing ? (
                <input
                  autoFocus
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-transparent text-lg font-bold text-zinc-900 focus:outline-none border-b border-zinc-100 pb-1"
                />
              ) : (
                <p className="text-lg font-bold text-zinc-900">{user?.full_name || 'Anonymous User'}</p>
              )}
            </div>
            <p className="mt-2 text-xs font-medium text-zinc-400">{user?.email}</p>
          </div>
        </section>

        {/* Household Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-zinc-900">
              <Home className="h-4 w-4 text-zinc-400" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Household</h3>
            </div>
            {household?.owner_id === user?.id && (
              <span className="flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-600 border border-blue-100">
                <ShieldCheck className="h-3 w-3" />
                Owner
              </span>
            )}
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-100 bg-white p-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Board Name</p>
                {isEditing && household?.owner_id === user?.id ? (
                  <input
                    value={householdName}
                    onChange={(e) => setHouseholdName(e.target.value)}
                    className="w-full bg-transparent text-lg font-bold text-zinc-900 focus:outline-none border-b border-zinc-100 pb-1"
                  />
                ) : (
                  <p className="text-lg font-bold text-zinc-900">{household?.name}</p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-100 bg-zinc-50/30 p-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3">Invite ID</p>
              <button
                onClick={handleCopyId}
                className="group flex w-full items-center justify-between rounded-lg bg-white border border-zinc-100 p-3 text-left transition-all hover:border-zinc-300 active:scale-[0.98]"
              >
                <code className="text-xs font-mono text-zinc-500 overflow-hidden text-ellipsis mr-4">{household?.id}</code>
                {isCopied ? (
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                ) : (
                  <Copy className="h-4 w-4 text-zinc-300 group-hover:text-zinc-500 shrink-0" />
                )}
              </button>
              <p className="mt-3 text-[10px] text-zinc-400 text-center">Share this ID with family members to join the board.</p>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4">
          {isEditing ? (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setProfileName(user?.full_name || '');
                  setHouseholdName(household?.name || '');
                }}
                className="flex-1 rounded-lg bg-zinc-50 py-4 text-sm font-bold text-zinc-500 transition-all hover:bg-zinc-100 active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-[2] rounded-lg bg-zinc-900 py-4 text-sm font-bold text-white transition-all hover:bg-black disabled:opacity-50 active:scale-95"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full rounded-lg bg-zinc-900 py-4 text-sm font-bold text-white transition-all hover:bg-black active:scale-95"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50/30 py-4 text-sm font-bold text-red-500 transition-all hover:bg-red-50 active:scale-95"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
