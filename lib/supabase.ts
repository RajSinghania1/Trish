import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_') || supabaseAnonKey.includes('your_') || supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
  console.warn(
    '⚠️  Supabase not configured: Please set up your Supabase credentials in the .env file.\n' +
    'Get them from: https://supabase.com/dashboard/project/[your-project]/settings/api\n' +
    'The app will run in demo mode without backend functionality.'
  );
  
  // Create a mock client for demo purposes
  export const supabase = {
    auth: {
      signUp: () => Promise.resolve({ data: { user: null }, error: { message: 'Demo mode - Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: { message: 'Demo mode - Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
      update: () => ({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
      delete: () => ({ data: null, error: { message: 'Demo mode - Supabase not configured' } })
    })
  } as any;
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
}