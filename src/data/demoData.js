// ============================================================
//  demoData.js — ডেমো/প্লেসহোল্ডার ডেটা
//  Supabase কানেকশন না থাকলে বা ডেটা না পেলে এই ডেটা দেখানো হয়।
//  আসল তথ্য এখানে রাখবেন না — আসল তথ্য /admin প্যানেল থেকে
//  Supabase-এ সেভ করুন।
// ============================================================

export const personalInfo = {
  name:        'আপনার নাম',
  fullName:    'আপনার সম্পূর্ণ নাম',
  title:       'আপনার পদবি / পরিচয়',
  roles:       ['লেখক', 'শিক্ষক', 'বক্তা'],
  tagline:     'এক লাইনে নিজের পরিচয়',
  bio: [
    'এখানে আপনার সংক্ষিপ্ত পরিচিতি লিখুন। /admin প্যানেলে লগইন করে এই অংশটি পরিবর্তন করতে পারবেন।',
    'এই টেক্সট শুধু ডেমো — Supabase কানেক্ট করার পর এখানে আপনার আসল তথ্য দেখা যাবে।',
  ],
  specialization: 'আপনার বিশেষত্বের ক্ষেত্র',
  languages:      'বাংলা, ইংরেজি',
  profileImage:   '/images/profile.jpeg',
  cvUrl:          '/cv.pdf',
  copyright:      '© ২০২৬ আপনার নাম · সর্বস্বত্ব সংরক্ষিত',
}

export const contactInfo = {
  phone:    '01XXX-XXXXXX',
  phoneTel: 'tel:+880XXXXXXXXXX',
  email:    'youremail@example.com',
  location: 'আপনার শহর, বাংলাদেশ',
  whatsapp: 'https://wa.me/880XXXXXXXXXX',
}

export const socialLinks = [
  {
    label:      'ফেসবুক আইডি',
    platform:   'fb_id',
    href:       '#',
    hoverBorder:'rgba(59,130,246,.25)',
    hoverBg:    'rgba(59,130,246,.07)',
    hoverColor: '#3b82f6',
  },
  {
    label:      'ফেসবুক পেজ',
    platform:   'fb_page',
    href:       '#',
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

export const navItems = [
  { href: '#porichiti',  label: 'পরিচিতি' },
  { href: '#shikkha',    label: 'শিক্ষাজীবন' },
  { href: '#dayitto',    label: 'দায়িত্ব' },
  { href: '#lekhalekhi', label: 'লেখালেখি' },
]

export const stats = [
  { val: 0,  suf: '+',  label: 'বছরের অভিজ্ঞতা', icon: '🕌' },
  { val: 0,  suf: '+',  label: 'প্রকাশিত রচনা',  icon: '✍️' },
  { val: 0,  suf: 'টি', label: 'প্রকাশিত বই',    icon: '📚' },
  { val: 0,  suf: '+',  label: 'ছাত্র-ছাত্রী',   icon: '🎓' },
]

export const educations = [
  { year: '২০XX', degree: 'ডিগ্রির নাম', inst: 'প্রতিষ্ঠানের নাম', badge: '', highlight: false },
]

export const roles = [
  {
    icon:        '🕌',
    title:       'দায়িত্বের নাম',
    desc:        'দায়িত্বের সংক্ষিপ্ত বিবরণ এখানে লিখুন।',
    accentFrom:  'from-yellow-400',
    accentTo:    'to-yellow-600',
    hoverBg:     'hover:bg-yellow-500/6',
  },
]

export const writings = [
  {
    type: 'বই',
    title:'বইয়ের নাম',
    sub:  'প্রকাশনী · ২০xx',
    icon: '📗',
    gold: true,
    href: '#',
  },
]

export const quote = {
  arabic: '',
  bangla: '"এখানে একটি অনুপ্রেরণামূলক উক্তি লিখুন।"',
  source: '— উৎস',
}

export const footerDua = {
  arabic:        '',
  transliterate: '',
  translation:   '',
}
