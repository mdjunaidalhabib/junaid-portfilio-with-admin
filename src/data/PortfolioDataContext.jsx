import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import * as defaults from '../data/demoData'

// portfolioData.js-এর সব key এখানে লিস্ট করা — Supabase row না পেলে এই ডিফল্ট ডেটা দেখাবে
const SECTION_KEYS = [
  'personalInfo',
  'contactInfo',
  'socialLinks',
  'navItems',
  'stats',
  'educations',
  'roles',
  'writings',
  'quote',
  'footerDua',
]

const TABLE = 'portfolio_content'

const PortfolioDataContext = createContext(null)

export function PortfolioDataProvider({ children }) {
  const [data, setData] = useState(() => {
    const initial = {}
    SECTION_KEYS.forEach((key) => { initial[key] = defaults[key] })
    return initial
  })
  const [loading, setLoading] = useState(isSupabaseConfigured)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const { data: rows, error } = await supabase.from(TABLE).select('section_key, content')
      if (!error && rows) {
        const merged = {}
        SECTION_KEYS.forEach((key) => {
          const row = rows.find((r) => r.section_key === key)
          const saved = row ? row.content : null
          const base = defaults[key]
          if (saved && base && typeof base === 'object' && !Array.isArray(base)) {
            // পুরনো সেভ করা ডেটায় নতুন যুক্ত হওয়া ফিল্ড (যেমন cvUrl) না থাকলে
            // ডিফল্ট থেকে সেটা যুক্ত করে দেয়, যাতে সাইট ভেঙে না যায়
            merged[key] = { ...base, ...saved }
          } else {
            merged[key] = saved || base
          }
        })
        setData(merged)
      } else if (error) {
        console.error('Supabase থেকে ডেটা আনতে সমস্যা হয়েছে, ডেমো ডেটা দেখানো হচ্ছে:', error.message)
      }
    } catch (err) {
      console.error('Supabase কানেকশন ব্যর্থ, ডেমো ডেটা দেখানো হচ্ছে:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  return (
    <PortfolioDataContext.Provider value={{ ...data, loading, refresh }}>
      {children}
    </PortfolioDataContext.Provider>
  )
}

export function usePortfolioData() {
  const ctx = useContext(PortfolioDataContext)
  if (!ctx) throw new Error('usePortfolioData must be used inside PortfolioDataProvider')
  return ctx
}

export { SECTION_KEYS }
