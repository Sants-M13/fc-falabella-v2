import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Browser client for client-side operations
export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

// Note: For admin operations, use server actions in /lib/actions/users.ts
// The service role key is only available on the server side for security reasons