import { createClient } from "@supabase/supabase-js";

// Retrieve the Supabase configuration from build-time environment variables as a legacy/static fallback
const staticUrl = (import.meta as any).env.VITE_SUPABASE_URL || "";
const staticAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "";

export let supabaseUrl = staticUrl;
export let supabaseAnonKey = staticAnonKey;
export let isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

/**
 * Lazy-initialized Supabase client. Can be updated dynamically at runtime via updateSupabaseConfig.
 */
export let supabase: any = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Updates the Supabase configuration dynamically at runtime.
 */
export function updateSupabaseConfig(url: string, anonKey: string) {
  if (url && anonKey) {
    supabaseUrl = url;
    supabaseAnonKey = anonKey;
    isSupabaseConfigured = true;
    supabase = createClient(url, anonKey);
    console.log("[SupabaseClient] Supabase dynamically initialized successfully.");
  }
}

