import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_') || supabaseAnonKey.includes('your_')) {
  throw new Error(
    'Missing or invalid Supabase environment variables. Please check your .env file and ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set with your actual Supabase project credentials. Get them from: https://supabase.com/dashboard/project/[your-project]/settings/api'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);