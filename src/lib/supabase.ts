import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://kwoqztecdaphqlnrnhka.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_XnTcN1e127nC1QQRYIDTYA_dkwuQrBT';

if (!supabaseUrl || supabaseUrl === 'undefined') {
  console.warn('Supabase URL is missing. Using default fallback.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
});
