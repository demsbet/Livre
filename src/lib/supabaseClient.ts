import { createClient } from "@supabase/supabase-js";

// Retrieve the Supabase configuration from environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// Check if variables are configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

/**
 * Lazy-initialized Supabase client to avoid crashes if environment variables are not yet present.
 * If configured, returns the Supabase client instance. Otherwise, returns null.
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
