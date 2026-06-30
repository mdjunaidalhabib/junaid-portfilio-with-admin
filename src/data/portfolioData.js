// ============================================================
//  portfolioData.js — সব ডেটা এক জায়গায়
//  এই ফাইলটি এডিট করে পুরো পোর্টফোলিও আপডেট করুন
// ============================================================

// ─── ব্যক্তিগত তথ্য ──────────────────────────────────────────
export const personalInfo = {
  name:        'জুনাইদ আল হাবিব',
  fullName:    'মোহাম্মদ জুনাইদ আল হাবিব',
  title:       'আলিম ও খতিব',
  roles:       ['লেখক', 'মাদরাসা শিক্ষক', 'ইমাম ও খতিব'],
  tagline:     'আলিম · লেখক · শিক্ষক',
  bio: [
    'মোহাম্মদ জুনাইদ আল হাবিব একজন লেখক, মাদরাসা শিক্ষক এবং খতিব। দীর্ঘদিন ধরে তিনি দ্বীনি শিক্ষা ও দাওয়াতের কাজে যুক্ত আছেন এবং পাশাপাশি ইসলামি বিষয়ে লেখালেখি করে চলেছেন।',
    'তাঁর লেখার মূল বিষয় কুরআন-হাদীসের আলোকে সমকালীন জীবনের প্রশ্ন, ইসলামি ইতিহাস এবং সমাজ-সংস্কার।',
    'এই পাতাটি তাঁর শিক্ষাজীবন, দায়িত্ব ও প্রকাশিত লেখার একটি সংক্ষিপ্ত পরিচিতি।',
  ],
  specialization: 'তাফসীর ও হাদীস',
  languages:      'বাংলা, আরবি',
  profileImage:   '/images/profile.jpeg',
  copyright:      '© ২০২৬ মোহাম্মদ জুনাইদ আল হাবিব · সর্বস্বত্ব সংরক্ষিত',
}

// ─── যোগাযোগ তথ্য ────────────────────────────────────────────
export const contactInfo = {
  phone:    '01624-114405',
  phoneTel: 'tel:+8801624114405',
  email:    'mdjunaidalhabib2626@gmail.com',
  location: 'ঢাকা, বাংলাদেশ',
  whatsapp: 'https://wa.me/8801624114405',
}

// ─── সামাজিক মাধ্যম ──────────────────────────────────────────
// fb_id   → Hero section-এ ব্যবহার হয় (ব্যক্তিগত প্রোফাইল)
// fb_page → Footer ও Contact section-এ ব্যবহার হয় (পেজ)
export const socialLinks = [
  {
    label:      'ফেসবুক আইডি',
    platform:   'fb_id',
    href:       'https://www.facebook.com/share/1Biz9s6ueR',
    hoverBorder:'rgba(59,130,246,.25)',
    hoverBg:    'rgba(59,130,246,.07)',
    hoverColor: '#3b82f6',
  },
  {
    label:      'ফেসবুক পেজ',
    platform:   'fb_page',
    href:       'https://www.facebook.com/share/1CDyFiZyhe',
    hoverBorder:'rgba(59,130,246,.25)',
    hoverBg:    'rgba(59,130,246,.07)',
    hoverColor: '#3b82f6',
  },
  {
    label:      'ইউটিউব চ্যানেল',
    platform:   'youtube',
    href:       '#',
    hoverBorder:'rgba(239,68,68,.25)',
    hoverBg:    'rgba(239,68,68,.07)',
    hoverColor: '#ef4444',
  },
  {
    label:      'টেলিগ্রাম',
    platform:   'telegram',
    href:       '#',
    hoverBorder:'rgba(14,165,233,.25)',
    hoverBg:    'rgba(14,165,233,.07)',
    hoverColor: '#0ea5e9',
  },
]

// ─── ন্যাভবার লিংক ───────────────────────────────────────────
export const navItems = [
  { href: '#porichiti',  label: 'পরিচিতি' },
  { href: '#shikkha',    label: 'শিক্ষাজীবন' },
  { href: '#dayitto',    label: 'দায়িত্ব' },
  { href: '#lekhalekhi', label: 'লেখালেখি' },
]

// ─── পরিসংখ্যান (Stats) ──────────────────────────────────────
export const stats = [
  { val: 12,   suf: '+',  label: 'বছরের অভিজ্ঞতা', icon: '🕌' },
  { val: 50,   suf: '+',  label: 'প্রকাশিত রচনা',  icon: '✍️' },
  { val: 5,    suf: 'টি', label: 'প্রকাশিত বই',    icon: '📚' },
  { val: 1000, suf: '+',  label: 'ছাত্র-ছাত্রী',   icon: '🎓' },
]

// ─── শিক্ষাজীবন ──────────────────────────────────────────────
export const educations = [
  {
    year:      '২০XX',
    degree:    'দাওরায়ে হাদীস (তাকমিল)',
    inst:      '[প্রতিষ্ঠানের নাম]',
    badge:     'সর্বোচ্চ ফলাফলে উত্তীর্ণ',
    highlight: true,
  },
  {
    year:   '২০XX',
    degree: 'ফাজিল / আলিম',
    inst:   '[প্রতিষ্ঠানের নাম]',
  },
  {
    year:   '২০XX',
    degree: 'মাধ্যমিক (দাখিল)',
    inst:   '[প্রতিষ্ঠানের নাম]',
  },
]

// ─── কর্মক্ষেত্র ও দায়িত্ব ──────────────────────────────────
export const roles = [
  {
    icon:        '🕌',
    title:       'ইমাম ও খতিব',
    desc:        '[মসজিদের নাম লিখুন] — সাল ২০xx থেকে নিয়মিত ইমামতি ও জুমার খুতবা পরিচালনা করছেন।',
    accentFrom:  'from-yellow-400',
    accentTo:    'to-yellow-600',
    hoverBg:     'hover:bg-yellow-500/6',
  },
  {
    icon:        '📖',
    title:       'মাদরাসা শিক্ষক',
    desc:        '[মাদরাসার নাম লিখুন] — তাফসীর, হাদীস ও আরবি সাহিত্য বিভাগে শিক্ষকতা করছেন।',
    accentFrom:  'from-green-400',
    accentTo:    'to-green-600',
    hoverBg:     'hover:bg-green-500/6',
  },
  {
    icon:        '✍️',
    title:       'লেখক',
    desc:        'বিভিন্ন ইসলামি ম্যাগাজিন ও অনলাইন প্ল্যাটফর্মে নিয়মিত প্রবন্ধ ও বই লিখে চলেছেন।',
    accentFrom:  'from-yellow-400',
    accentTo:    'to-yellow-600',
    hoverBg:     'hover:bg-yellow-500/6',
  },
]

// ─── লেখালেখি / বই ───────────────────────────────────────────
export const writings = [
  {
    type: 'বই',
    title:'[বইয়ের নাম লিখুন]',
    sub:  '[প্রকাশনী] · ২০xx',
    icon: '📗',
    gold: true,
    href: '#',
  },
  {
    type: 'বই',
    title:'[বইয়ের নাম লিখুন]',
    sub:  '[প্রকাশনী] · ২০xx',
    icon: '📘',
    gold: true,
    href: '#',
  },
  {
    type: 'প্রবন্ধ',
    title:'[ম্যাগাজিন/পত্রিকার নাম]-এ নিয়মিত কলাম',
    sub:  'চলমান',
    icon: '📰',
    gold: false,
    href: '#',
  },
]

// ─── অনুপ্রেরণামূলক উক্তি ────────────────────────────────────
export const quote = {
  arabic:      'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
  bangla:      '"নিশ্চয়ই কাজের ফলাফল নিয়তের উপর নির্ভরশীল।"',
  source:      '— হাদীস, বুখারী ও মুসলিম',
}

// ─── ফুটারের আরবি দোয়া ───────────────────────────────────────
export const footerDua = {
  arabic:       'جَزَاكَ اللّهُ خَيْرًا',
  transliterate:'জাযাকাল্লাহু খাইরান',
  translation:  'আল্লাহ আপনাকে উত্তম প্রতিদান দিন',
}
