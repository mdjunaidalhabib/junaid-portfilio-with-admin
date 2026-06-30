// ============================================================
//  seed.js — আপনার বিদ্যমান portfolioData.js-এর আসল ডেটা
//  একবারে Supabase-এ পাঠানোর স্ক্রিপ্ট।
//
//  ব্যবহার:
//    node scripts/seed.js
//
//  এই স্ক্রিপ্টটি service_role key ব্যবহার করে (RLS বাইপাস করে
//  সরাসরি ইনসার্ট করার জন্য) — তাই .env ফাইলে এটাও যুক্ত করুন:
//    SUPABASE_SERVICE_ROLE_KEY=...
//  (Supabase Dashboard → Settings → API → service_role key)
//
//  ⚠️ service_role key কখনো ক্লায়েন্ট/ব্রাউজার কোডে বা git-এ
//  পুশ করবেন না — এটা শুধু এই লোকাল স্ক্রিপ্টে একবার চালানোর
//  জন্য ব্যবহার করুন।
// ============================================================

import { createClient } from '@supabase/supabase-js'
import * as portfolioData from '../src/data/portfolioData.js'
import 'dotenv/config'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('VITE_SUPABASE_URL ও SUPABASE_SERVICE_ROLE_KEY .env ফাইলে সেট করুন।')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

const SECTION_KEYS = [
  'personalInfo', 'contactInfo', 'socialLinks', 'navItems',
  'stats', 'educations', 'roles', 'writings', 'quote', 'footerDua',
]

async function main() {
  for (const key of SECTION_KEYS) {
    const { error } = await supabase
      .from('portfolio_content')
      .upsert({ section_key: key, content: portfolioData[key] }, { onConflict: 'section_key' })
    if (error) {
      console.error(`✗ ${key}:`, error.message)
    } else {
      console.log(`✓ ${key} সেভ হয়েছে`)
    }
  }
}

main()
