import { createClient } from "@supabase/supabase-js";

function sanitizeConfig(val: string): string {
  if (!val) return "";
  let clean = val.trim();
  // Remove surrounding double quotes
  if (clean.startsWith('"') && clean.endsWith('"')) {
    clean = clean.substring(1, clean.length - 1).trim();
  }
  // Remove surrounding single quotes
  if (clean.startsWith("'") && clean.endsWith("'")) {
    clean = clean.substring(1, clean.length - 1).trim();
  }
  return clean;
}

function sanitizeUrl(url: string): string {
  let clean = sanitizeConfig(url);
  // Remove trailing slashes
  while (clean.endsWith("/")) {
    clean = clean.substring(0, clean.length - 1).trim();
  }
  
  // Check if they appended /rest/v1 or rest/v1 and strip it
  if (clean.endsWith("/rest/v1")) {
    clean = clean.substring(0, clean.length - "/rest/v1".length).trim();
  }
  if (clean.endsWith("/auth/v1")) {
    clean = clean.substring(0, clean.length - "/auth/v1".length).trim();
  }
  
  // Remove trailing slashes again just in case
  while (clean.endsWith("/")) {
    clean = clean.substring(0, clean.length - 1).trim();
  }
  return clean;
}

// Retrieve the Supabase configuration from build-time environment variables as a legacy/static fallback
const staticUrl = sanitizeUrl(import.meta.env.VITE_SUPABASE_URL || "");
const staticAnonKey = sanitizeConfig(import.meta.env.VITE_SUPABASE_ANON_KEY || "");

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
  const cleanUrl = sanitizeUrl(url);
  const cleanKey = sanitizeConfig(anonKey);
  if (cleanUrl && cleanKey) {
    supabaseUrl = cleanUrl;
    supabaseAnonKey = cleanKey;
    isSupabaseConfigured = true;
    supabase = createClient(cleanUrl, cleanKey);
    console.log("[SupabaseClient] Supabase dynamically initialized successfully with sanitized values.");
  }
}

