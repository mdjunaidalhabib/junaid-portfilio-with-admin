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
  'hikmahIt',
  'writings',
  'quote',
  'footerDua',
  'sectionVisibility',
]

const TABLE = 'portfolio_content'
const CACHE_KEY = 'portfolio_content_cache_v1'

// আগের ভিজিটে সেভ করা আসল ডেটা localStorage থেকে পড়ে — এতে দ্বিতীয়বার
// থেকে সাইট খোলার সাথে সাথেই আসল কন্টেন্ট দেখা যায়, মাঝখানে ডেমো
// প্লেসহোল্ডার (যেমন "০+" পরিসংখ্যান কার্ড) মুহূর্তের জন্যও চোখে পড়ে না
function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

function saveCache(data) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)) } catch { /* private mode ইত্যাদিতে ব্যর্থ হলে উপেক্ষা করা হয় */ }
}

const PortfolioDataContext = createContext(null)

export function PortfolioDataProvider({ children }) {
  const [data, setData] = useState(() => {
    const cached = isSupabaseConfigured ? loadCache() : null
    const initial = {}
    SECTION_KEYS.forEach((key) => { initial[key] = cached && cached[key] !== undefined ? cached[key] : defaults[key] })
    return initial
  })
  // সাইট সবসময় সাথে সাথে (cache করা আগের আসল ডেটা, নয়তো ডিফল্ট) দিয়ে
  // রেন্ডার হয় — লোডিং স্ক্রিনের পেছনে পুরো পেজ আটকে থাকে না। Supabase
  // থেকে আসল ডেটা এলে নিঃশব্দে পেছনে পেছনে বদলে যায় এবং cache আপডেট হয়।
  // ডেটা আগের মতোই (অপরিবর্তিত) থাকলে state আপডেট করা হয় না — তাই
  // পরিসংখ্যানের কাউন্টার/অ্যানিমেশন প্রতিবার লোডে অকারণে রিস্টার্ট হয় না।
  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) return
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
        setData((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(merged)) return prev
          saveCache(merged)
          return merged
        })
      } else if (error) {
        console.error('Supabase থেকে ডেটা আনতে সমস্যা হয়েছে, ডেমো ডেটা দেখানো হচ্ছে:', error.message)
      }
    } catch (err) {
      console.error('Supabase কানেকশন ব্যর্থ, ডেমো ডেটা দেখানো হচ্ছে:', err)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  return (
    <PortfolioDataContext.Provider value={{ ...data, refresh }}>
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
