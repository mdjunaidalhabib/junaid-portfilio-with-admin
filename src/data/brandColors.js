// ============================================================
//  brandColors.js — সামাজিক মাধ্যম আইকনের নিজস্ব (brand) রঙ
//  Footer, Hero, Contact — সব জায়গায় এই একই রঙ ব্যবহার হয়
// ============================================================
import { FaFacebook, FaYoutube, FaTelegram, FaWhatsapp, FaTwitter, FaInstagram, FaLinkedin, FaTiktok, FaGlobe, FaEnvelope } from 'react-icons/fa'

export const BRAND = {
  facebook:  { color: '#1877F2', bg: 'rgba(24,119,242,.09)', border: 'rgba(24,119,242,.24)' },
  whatsapp:  { color: '#25D366', bg: 'rgba(37,211,102,.09)', border: 'rgba(37,211,102,.24)' },
  youtube:   { color: '#FF0000', bg: 'rgba(255,0,0,.08)',    border: 'rgba(255,0,0,.22)'   },
  telegram:  { color: '#26A5E4', bg: 'rgba(38,165,228,.09)', border: 'rgba(38,165,228,.24)' },
  twitter:   { color: '#000000', bg: 'rgba(0,0,0,.06)',      border: 'rgba(0,0,0,.18)'      },
  instagram: { color: '#E1306C', bg: 'rgba(225,48,108,.09)', border: 'rgba(225,48,108,.24)'  },
  linkedin:  { color: '#0A66C2', bg: 'rgba(10,102,194,.09)', border: 'rgba(10,102,194,.24)'  },
  tiktok:    { color: '#000000', bg: 'rgba(0,0,0,.06)',      border: 'rgba(0,0,0,.18)'      },
  email:     { color: '#16a34a', bg: 'rgba(22,163,74,.08)',  border: 'rgba(22,163,74,.22)'  },
  website:   { color: '#475569', bg: 'rgba(71,85,105,.08)',  border: 'rgba(71,85,105,.22)'  },
}

// লিংক (href) দেখে স্বয়ংক্রিয়ভাবে প্ল্যাটফর্ম শনাক্ত করে — এডমিন থেকে
// আর আলাদা করে "প্ল্যাটফর্ম" ফিল্ড বেছে নেওয়ার দরকার নেই, শুধু লিংক দিলেই হবে।
export function detectPlatform(href) {
  const h = (href || '').toLowerCase()
  if (h.includes('facebook.com') || h.includes('fb.com') || h.includes('fb.me')) return 'facebook'
  if (h.includes('wa.me') || h.includes('whatsapp.com')) return 'whatsapp'
  if (h.includes('youtube.com') || h.includes('youtu.be')) return 'youtube'
  if (h.includes('t.me') || h.includes('telegram')) return 'telegram'
  if (h.includes('twitter.com') || h.includes('x.com')) return 'twitter'
  if (h.includes('instagram.com')) return 'instagram'
  if (h.includes('linkedin.com')) return 'linkedin'
  if (h.includes('tiktok.com')) return 'tiktok'
  return 'website'
}

// "সামাজিক মাধ্যম" এর জেনেরিক লিংক ফিল্ডে হোয়াটসঅ্যাপের জন্য শুধু নাম্বার
// লিখলেই (লেবেলে "WhatsApp/হোয়াটসঅ্যাপ" লেখা থাকলে, বা মানটা শুধু সংখ্যা
// হলে) এটা স্বয়ংক্রিয়ভাবে সঠিক wa.me লিংকে রূপান্তরিত হয়ে যায় — আলাদা
// করে পুরো লিংক টাইপ করার দরকার হয় না
export function resolveSocialHref(label, href) {
  const raw = (href || '').trim()
  if (!raw || raw === '#' || /^(https?:|mailto:|tel:)/i.test(raw)) return raw
  const looksLikeWhatsapp = /whatsapp|হোয়াটসঅ্যাপ/i.test(label || '') || /^[+]?[\d\s-]{6,}$/.test(raw)
  if (!looksLikeWhatsapp) return raw
  let d = raw.replace(/\D/g, '')
  if (d.startsWith('880')) d = d.slice(3)
  else if (d.startsWith('88')) d = d.slice(2)
  if (d.startsWith('0')) d = d.slice(1)
  return d ? `https://wa.me/880${d}` : raw
}

// এডমিন প্যানেলে যে লিংকগুলো এখনো খালি/প্লেসহোল্ডার ('#' বা ফাঁকা) রয়ে গেছে,
// সেগুলো ফ্রন্টএন্ডে না দেখানোর জন্য এই ফাংশন দিয়ে ফিল্টার করা হয়
export function hasValidLink(href) {
  const h = (href || '').trim()
  return h !== '' && h !== '#'
}

export const PLATFORM_ICONS = {
  facebook:  FaFacebook,
  whatsapp:  FaWhatsapp,
  youtube:   FaYoutube,
  telegram:  FaTelegram,
  twitter:   FaTwitter,
  instagram: FaInstagram,
  linkedin:  FaLinkedin,
  tiktok:    FaTiktok,
  website:   FaGlobe,
  email:     FaEnvelope,
}

// প্রত্যক্ষ যোগাযোগ (ফোন/ইমেইল/লোকেশন) — বাস্তব জগতের পরিচিত রঙ
export const CONTACT_COLORS = {
  phone:    { color: '#22C55E', bg: 'rgba(34,197,94,.09)',  border: 'rgba(34,197,94,.24)'  }, // কল বাটনের সবুজ
  mail:     { color: '#3B82F6', bg: 'rgba(59,130,246,.09)', border: 'rgba(59,130,246,.24)' }, // মেইলের নীল
  location: { color: '#EF4444', bg: 'rgba(239,68,68,.09)',  border: 'rgba(239,68,68,.24)'  }, // ম্যাপ পিনের লাল
}
