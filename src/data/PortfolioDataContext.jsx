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
            // ডিফল্ট থেকে সেটা যুক্ত করে দেয়, যাতে সাইট ভেঙে না যায়।
            // আর যেসব ফিল্ড আর ব্যবহার হয় না (যেমন phoneTel, copyright) সেগুলো
            // পুরনো সেভ করা ডেটায় থাকলেও এখানে বাদ পড়ে যায়।
            merged[key] = { ...base }
            Object.keys(base).forEach((field) => {
              if (saved[field] !== undefined) merged[key][field] = saved[field]
            })
          } else {
            merged[key] = saved || base
          }
        })
        // অ্যারে-টাইপ সেকশনের প্রতিটা আইটেমকে বর্তমান ডিফল্ট শেপের সাথে মিলিয়ে নেয় —
        // নতুন ফিল্ড (যেমন badge) না থাকলে খালি মান যোগ হয়, পুরনো অব্যবহৃত ফিল্ড
        // (highlight, platform, accentFrom ইত্যাদি) থাকলে বাদ পড়ে যায়
        SECTION_KEYS.forEach((key) => {
          const template = Array.isArray(defaults[key]) ? defaults[key][0] : null
          if (Array.isArray(merged[key]) && template && typeof template === 'object') {
            const shapeKeys = Object.keys(template)
            merged[key] = merged[key].map((item) => {
              const normalized = {}
              shapeKeys.forEach((field) => {
                normalized[field] = item && item[field] !== undefined ? item[field] : template[field]
              })
              return normalized
            })
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
