import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client initialization
 * Reads configuration from environment variables:
 * - REACT_APP_SUPABASE_URL
 * - REACT_APP_SUPABASE_KEY
 *
 * Do not hardcode these values; set them in .env based on deployment environment.
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

// PUBLIC_INTERFACE
export const isSupabaseConfigured = () => {
  /** Returns true if Supabase env variables are present. */
  return Boolean(supabaseUrl && supabaseKey);
};

// Create client only if configured, otherwise export a dummy object to prevent runtime crashes
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey)
  : null;
