// ============================================================
//  brandColors.js — সামাজিক মাধ্যম আইকনের নিজস্ব (brand) রঙ
//  Footer, Hero, Contact — সব জায়গায় এই একই রঙ ব্যবহার হয়
// ============================================================
export const BRAND = {
  facebook: { color: '#1877F2', bg: 'rgba(24,119,242,.09)',  border: 'rgba(24,119,242,.24)' },
  whatsapp: { color: '#25D366', bg: 'rgba(37,211,102,.09)',  border: 'rgba(37,211,102,.24)' },
  youtube:  { color: '#FF0000', bg: 'rgba(255,0,0,.08)',     border: 'rgba(255,0,0,.22)'   },
  telegram: { color: '#26A5E4', bg: 'rgba(38,165,228,.09)',  border: 'rgba(38,165,228,.24)' },
  email:    { color: '#16a34a', bg: 'rgba(22,163,74,.08)',   border: 'rgba(22,163,74,.22)'  },
}

// প্রত্যক্ষ যোগাযোগ (ফোন/ইমেইল/লোকেশন) — বাস্তব জগতের পরিচিত রঙ
export const CONTACT_COLORS = {
  phone:    { color: '#22C55E', bg: 'rgba(34,197,94,.09)',  border: 'rgba(34,197,94,.24)'  }, // কল বাটনের সবুজ
  mail:     { color: '#3B82F6', bg: 'rgba(59,130,246,.09)', border: 'rgba(59,130,246,.24)' }, // মেইলের নীল
  location: { color: '#EF4444', bg: 'rgba(239,68,68,.09)',  border: 'rgba(239,68,68,.24)'  }, // ম্যাপ পিনের লাল
}
