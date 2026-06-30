import { createClient } from '@supabase/supabase-js'

// .env ফাইলে এই দুইটা ভ্যারিয়েবল সেট করতে হবে:
// VITE_SUPABASE_URL=...
// VITE_SUPABASE_ANON_KEY=...
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let client = null
let configured = false

try {
  if (supabaseUrl && supabaseAnonKey) {
    client = createClient(supabaseUrl, supabaseAnonKey)
    configured = true
  }
} catch (err) {
  // ভুল URL/key দিলেও যেন পুরো অ্যাপ ক্র্যাশ করে সাদা স্ক্রিন না দেখায়
  console.error('Supabase client তৈরি করা যায়নি, ডেমো ডেটা দেখানো হবে:', err)
  client = null
  configured = false
}

export const isSupabaseConfigured = configured
export const supabase = client

