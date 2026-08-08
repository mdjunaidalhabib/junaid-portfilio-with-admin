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
  profileImage:   '/images/profile.webp',
  cvUrl:          '/cv.pdf',
}

// ফোন/হোয়াটসঅ্যাপ নাম্বার শুধু সংখ্যা আকারে দিন (+৮৮ ছাড়া) —
// tel: ও wa.me লিংক কোড থেকেই অটোমেটিক তৈরি হয়ে যাবে
export const contactInfo = {
  phone:    '01XXX-XXXXXX',
  email:    'youremail@example.com',
  location: 'আপনার শহর, বাংলাদেশ',
  whatsapp: '01XXX-XXXXXX',
}

// প্রতিটার শুধু নাম ও লিংক দিলেই হবে — আইকন ও রঙ লিংক দেখে অটোমেটিক ঠিক হয়ে যায়
export const socialLinks = [
  { label: 'ফেসবুক আইডি',    href: '#' },
  { label: 'ফেসবুক পেজ',     href: '#' },
  { label: 'ইউটিউব চ্যানেল', href: '#' },
  { label: 'টেলিগ্রাম',      href: '#' },
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
  { year: '২০XX', degree: 'ডিগ্রির নাম', inst: 'প্রতিষ্ঠানের নাম', badge: '', category: 'madrasha', grade: '', point: '' },
]

export const roles = [
  {
    icon:  '🕌',
    title: 'দায়িত্বের নাম',
    desc:  'দায়িত্বের সংক্ষিপ্ত বিবরণ এখানে লিখুন।',
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

// দায়িত্ব সেকশনের পরে দেখানো সংক্ষিপ্ত পরিচিতি — নিজের প্রতিষ্ঠিত
// প্রতিষ্ঠান/উদ্যোগ সম্পর্কে ২-৩ লাইনের লেখা
export const hikmahIt = {
  heading: 'Hikmah IT',
  text: 'Hikmah IT সম্পর্কে এখানে সংক্ষিপ্ত বর্ণনা লিখুন। /admin প্যানেলে লগইন করে এই লেখা পরিবর্তন করতে পারবেন।',
}

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

// কোন কোন সেকশন পাবলিক সাইটে দেখানো হবে — অ্যাডমিন প্যানেল থেকে
// যেকোনো সেকশন বন্ধ (false) করলে সেটা সাইটে আর দেখাবে না
export const sectionVisibility = {
  stats:     true,
  about:     true,
  education: true,
  roles:     true,
  hikmah:    true,
  writings:  true,
  quote:     true,
  contact:   true,
}
