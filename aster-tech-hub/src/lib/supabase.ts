import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Singleton instance to prevent multiple client warnings
let supabaseInstance: any = null;

export const getSupabaseBrowserClient = () => {
  if (supabaseInstance) return supabaseInstance;

  supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};

// For backward compatibility with existing code
export const supabase = getSupabaseBrowserClient();
