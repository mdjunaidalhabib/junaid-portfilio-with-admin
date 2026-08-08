import { useEffect, useState, useRef } from 'react'
import {
  Eye, EyeOff, Pencil, Check, LogOut, LayoutDashboard,
  User, Phone, Share2, Menu, BarChart3, GraduationCap,
  Briefcase, BookOpen, Quote as QuoteIcon, MoonStar, KeyRound,
  Image as ImageIcon, FileText, UploadCloud, Loader2, Building2,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { uploadAsset } from '../lib/storage'
import * as defaults from '../data/demoData'
import { useToast } from './Toast'

const SECTION_ICONS = {
  personalInfo: User,
  contactInfo: Phone,
  socialLinks: Share2,
  navItems: Menu,
  stats: BarChart3,
  educations: GraduationCap,
  roles: Briefcase,
  organization: Building2,
  writings: BookOpen,
  quote: QuoteIcon,
  footerDua: MoonStar,
  account: KeyRound,
}

const SECTIONS = [
  { key: 'personalInfo', label: 'ব্যক্তিগত তথ্য', type: 'object' },
  { key: 'contactInfo', label: 'যোগাযোগ তথ্য', type: 'object' },
  { key: 'socialLinks', label: 'সামাজিক মাধ্যম', type: 'array' },
  { key: 'navItems', label: 'ন্যাভবার লিংক', type: 'array' },
  { key: 'stats', label: 'পরিসংখ্যান', type: 'array' },
  { key: 'educations', label: 'শিক্ষাজীবন', type: 'array' },
  { key: 'roles', label: 'কর্মক্ষেত্র ও দায়িত্ব', type: 'array' },
  { key: 'organization', label: 'প্রতিষ্ঠান', type: 'object' },
  { key: 'writings', label: 'লেখালেখি / বই', type: 'array' },
  { key: 'quote', label: 'অনুপ্রেরণামূলক উক্তি', type: 'object' },
  { key: 'footerDua', label: 'ফুটারের আরবি দোয়া', type: 'object' },
  { key: 'account', label: 'পাসওয়ার্ড পরিবর্তন', type: 'account' },
]

const SECTION_VISIBILITY_LABELS = {
  stats:     { label: 'পরিসংখ্যান',            hint: 'অভিজ্ঞতা, রচনা, বই, ছাত্র-ছাত্রীর সংখ্যার বার' },
  about:     { label: 'পরিচিতি',               hint: '"আমার সম্পর্কে" সেকশন' },
  education: { label: 'শিক্ষাগত যোগ্যতা',       hint: 'মাদরাসা ও সাধারণ শিক্ষা' },
  roles:     { label: 'কর্মক্ষেত্র ও দায়িত্ব', hint: '' },
  organization: { label: 'প্রতিষ্ঠান',          hint: 'দায়িত্ব সেকশনের পরে দেখায়' },
  writings:  { label: 'লেখালেখি / বই',          hint: '' },
  quote:     { label: 'অনুপ্রেরণামূলক উক্তি',    hint: '' },
  contact:   { label: 'যোগাযোগ',                hint: 'ফোন, ইমেইল ও সামাজিক মাধ্যম' },
}

// এডমিনের কোন ট্যাব কোন সেকশন-দৃশ্যমানতা কী নিয়ন্ত্রণ করে — এই ম্যাপ
// অনুযায়ী প্রতিটা সংশ্লিষ্ট ট্যাবের উপরেই একটা চালু/বন্ধ সুইচ দেখানো হয়,
// যাতে আলাদা "সেকশন দৃশ্যমানতা" ট্যাব খুঁজে বের করতে না হয়
const VISIBILITY_MAP = {
  personalInfo: 'about',
  contactInfo: 'contact',
  socialLinks: 'contact',
  stats: 'stats',
  educations: 'education',
  roles: 'roles',
  organization: 'organization',
  writings: 'writings',
  quote: 'quote',
}

const TABLE = 'portfolio_content'

export default function AdminPanel({ onLogout }) {
  const toast = useToast()
  const [activeKey, setActiveKey] = useState(SECTIONS[0].key)
  const [content, setContent] = useState({})
  const [original, setOriginal] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [version, setVersion] = useState(0) // বাড়লে সব ফিল্ড আবার রিড-মোডে চলে যায়
  const [editingField, setEditingField] = useState(null) // একসাথে একটাই ফিল্ড এডিট-মোডে থাকবে

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    const { data, error } = await supabase.from(TABLE).select('section_key, content')
    const merged = {}
    // মেনু ট্যাবে দেখানো হয় না এমন কিছু কী (যেমন sectionVisibility) থাকলেও
    // ডেটাবেজ থেকে অবশ্যই লোড/মার্জ করতে হবে, নাহলে টগল বাটন ভুল অবস্থা দেখাবে
    const LOAD_KEYS = [...SECTIONS.map((s) => s.key), 'sectionVisibility']
    LOAD_KEYS.forEach((key) => {
      const type = SECTIONS.find((s) => s.key === key)?.type || 'object'
      const row = !error && data ? data.find((r) => r.section_key === key) : null
      const saved = row ? row.content : null
      const base = defaults[key]

      if (saved && (type === 'object' || type === 'visibility') && base && typeof base === 'object' && !Array.isArray(base)) {
        // পুরনো সেভ করা ডেটায় নতুন যুক্ত হওয়া ফিল্ড (যেমন cvUrl) না থাকলে
        // ডিফল্ট থেকে সেটা যুক্ত করে দেয়। আর যেসব ফিল্ড আর ব্যবহার হয় না
        // (যেমন phoneTel, copyright) সেগুলো পুরনো ডেটায় থাকলেও বাদ পড়ে যায়,
        // ফলে এডমিন প্যানেলে অপ্রয়োজনীয় ফিল্ড আর দেখা যাবে না।
        merged[key] = { ...base }
        Object.keys(base).forEach((field) => {
          if (saved[field] !== undefined) merged[key][field] = saved[field]
        })
      } else {
        merged[key] = saved || base
      }
    })

    // অ্যারে-টাইপ সেকশনের প্রতিটা আইটেমকে বর্তমান ডিফল্ট শেপের সাথে মিলিয়ে নেয় —
    // এতে করে কোনো আইটেমে নতুন ফিল্ড (যেমন সব শিক্ষাজীবনে "badge") না থাকলে
    // সেটা খালি মান দিয়ে যোগ হয়ে যায়, আবার পুরনো অপ্রয়োজনীয় ফিল্ড (highlight,
    // platform, accentFrom, hoverBg ইত্যাদি) থাকলে বাদ পড়ে যায়
    SECTIONS.forEach(({ key, type }) => {
      const template = Array.isArray(defaults[key]) ? defaults[key][0] : null
      if (type === 'array' && Array.isArray(merged[key]) && template && typeof template === 'object') {
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

    setContent(merged)
    setOriginal(JSON.parse(JSON.stringify(merged)))
    setLoading(false)
  }

  function updateField(sectionKey, value) {
    setContent((prev) => ({ ...prev, [sectionKey]: value }))
  }

  async function saveSection(sectionKey) {
    setSaving(true)
    const { error } = await supabase
      .from(TABLE)
      .upsert({ section_key: sectionKey, content: content[sectionKey] }, { onConflict: 'section_key' })
    setSaving(false)
    if (error) {
      toast.error('সেভ করতে সমস্যা হয়েছে: ' + error.message)
      return
    }
    toast.success('সফলভাবে আপডেট হয়েছে ✓')
    setOriginal((prev) => ({ ...prev, [sectionKey]: JSON.parse(JSON.stringify(content[sectionKey])) }))
    setVersion((v) => v + 1) // সব ফিল্ড আবার রিড-মোডে রিসেট হবে
    setEditingField(null)
  }

  // সেকশন চালু/বন্ধ — অন্যান্য ফিল্ডের মতো "আপডেট করুন" চাপার অপেক্ষা না
  // করে সাথে সাথেই সেভ হয়ে যায় (এটা আলাদা section_key: 'sectionVisibility'
  // রো-তে থাকে, তাই বর্তমান ট্যাবের সেভ বাটনের সাথে এটা জড়িত নয়)
  async function toggleSectionVisibility(visKey) {
    const current = content.sectionVisibility || {}
    const next = { ...current, [visKey]: !current[visKey] }
    setContent((prev) => ({ ...prev, sectionVisibility: next }))
    const { error } = await supabase
      .from(TABLE)
      .upsert({ section_key: 'sectionVisibility', content: next }, { onConflict: 'section_key' })
    if (error) {
      setContent((prev) => ({ ...prev, sectionVisibility: current })) // ব্যর্থ হলে আগের অবস্থায় ফিরিয়ে নেয়
      toast.error('সেভ করতে সমস্যা হয়েছে: ' + error.message)
      return
    }
    setOriginal((prev) => ({ ...prev, sectionVisibility: JSON.parse(JSON.stringify(next)) }))
    toast.success(next[visKey] ? 'সেকশনটি সাইটে দেখানো হচ্ছে ✓' : 'সেকশনটি সাইট থেকে লুকানো হয়েছে')
  }

  const activeSection = SECTIONS.find((s) => s.key === activeKey)
  const isDirty = JSON.stringify(content[activeKey]) !== JSON.stringify(original[activeKey])
  const activeVisKey = VISIBILITY_MAP[activeKey]
  const activeVisOn = activeVisKey ? !!(content.sectionVisibility || {})[activeVisKey] : true

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-md sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <span className="bg-green-500/20 text-green-400 rounded-lg p-2">
            <LayoutDashboard size={18} />
          </span>
          <h1 className="font-bold tracking-tight">পোর্টফোলিও এডমিন প্যানেল</h1>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-sm font-medium bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-md px-3.5 py-2 transition-colors shadow-sm"
        >
          <LogOut size={15} />
          লগআউট
        </button>
      </header>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-500">লোড হচ্ছে...</div>
      ) : (
        <div className="flex-1 flex flex-col sm:flex-row">
          <nav className="sm:w-64 bg-white border-r border-slate-200 p-3 flex sm:flex-col gap-1 overflow-x-auto shadow-sm">
            {SECTIONS.map((s) => {
              const Icon = SECTION_ICONS[s.key] || User
              const active = activeKey === s.key
              return (
                <button
                  key={s.key}
                  onClick={() => { setActiveKey(s.key); setEditingField(null) }}
                  className={`flex items-center gap-2.5 text-left text-sm rounded-lg px-3.5 py-2.5 whitespace-nowrap transition-all ${
                    active
                      ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-sm font-medium'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon size={16} className={active ? 'text-white' : 'text-slate-400'} />
                  {s.label}
                </button>
              )
            })}
          </nav>

          <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-slate-800">{activeSection.label}</h2>
                  {activeVisKey && (
                    <button
                      type="button"
                      role="switch"
                      aria-checked={activeVisOn}
                      onClick={() => toggleSectionVisibility(activeVisKey)}
                      title={
                        (activeVisOn ? 'সাইটে দেখানো হচ্ছে — বন্ধ করতে চাপুন। ' : 'সাইটে লুকানো আছে — চালু করতে চাপুন। ') +
                        (SECTION_VISIBILITY_LABELS[activeVisKey]?.hint || `"${SECTION_VISIBILITY_LABELS[activeVisKey]?.label || ''}" সেকশন নিয়ন্ত্রণ করে`)
                      }
                      className={`flex items-center gap-1.5 text-xs font-medium rounded-full pl-1 pr-2.5 py-1 border transition-colors ${
                        activeVisOn
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : 'bg-slate-100 border-slate-300 text-slate-500'
                      }`}
                    >
                      <span className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${activeVisOn ? 'bg-green-600' : 'bg-slate-300'}`}>
                        <span className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform ${activeVisOn ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                      </span>
                      {activeVisOn ? 'সাইটে দেখানো হচ্ছে' : 'সাইটে লুকানো আছে'}
                    </button>
                  )}
                </div>

                {activeSection.type !== 'account' && (
                  <div className="flex items-center gap-3">
                    {!isDirty && !saving && (
                      <span className="text-xs text-slate-400">কোনো পরিবর্তন করা হয়নি</span>
                    )}
                    <button
                      onClick={() => saveSection(activeKey)}
                      disabled={saving || !isDirty}
                      className={`text-sm font-medium rounded-md px-5 py-2 transition-colors ${
                        isDirty && !saving
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {saving ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
                    </button>
                  </div>
                )}
              </div>

              {activeVisKey && !activeVisOn && (
                <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2.5 mb-4">
                  <EyeOff size={14} className="flex-shrink-0" />
                  "{SECTION_VISIBILITY_LABELS[activeVisKey]?.label}" সেকশনটি এখন সাইটে বন্ধ আছে — ভিজিটররা এটা দেখতে পাচ্ছেন না। এখানে যা পরিবর্তন করবেন তা সেভ হবে, তবে সাইটে দেখা যাবে উপরের সুইচ আবার চালু করলে।
                </div>
              )}

              {activeSection.type === 'account' ? (
                <ChangePasswordForm />
              ) : activeSection.type === 'object' ? (
                <ObjectEditor
                  sectionKey={activeKey}
                  version={version}
                  value={content[activeKey]}
                  onChange={(v) => updateField(activeKey, v)}
                  editingField={editingField}
                  setEditingField={setEditingField}
                />
              ) : (
                <ArrayEditor
                  sectionKey={activeKey}
                  version={version}
                  value={content[activeKey]}
                  onChange={(v) => updateField(activeKey, v)}
                  editingField={editingField}
                  setEditingField={setEditingField}
                />
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  )
}

// contactInfo ফিল্ডের জন্য বাংলা লেবেল ও সহায়ক টেক্সট
const CONTACT_FIELD_META = {
  phone:    { label: 'মোবাইল নাম্বার',            hint: 'যেমন: 01624-114405 — শুধু নাম্বার দিন, বাকিটা (কল লিংক) অটোমেটিক তৈরি হবে' },
  whatsapp: { label: 'হোয়াটসঅ্যাপ নাম্বার',        hint: 'শুধু নাম্বার দিন (+৮৮ ছাড়া), যেমন: 01624-114405 — লিংক অটোমেটিক তৈরি হবে' },
  email:    { label: 'ইমেইল',                     hint: '' },
  location: { label: 'ঠিকানা',                    hint: '' },
}

// ── অবজেক্ট (key: value) এডিটর ───────────────────────────────
const OBJECT_FIELD_LABELS = {
  personalInfo: {
    name:           'নাম (সংক্ষিপ্ত) — লোগো, হিরো সেকশন ও ফুটারে দেখায়',
    fullName:       'পূর্ণ নাম — "আমার সম্পর্কে" সেকশনের তথ্য কার্ডে দেখায়',
    title:          'পদবি/উপাধি — হিরো সেকশনে নামের উপরে দেখায়',
    roles:          'ভূমিকা/পরিচয় (প্রতি লাইনে একটি) — হিরো সেকশনে ব্যাজ আকারে দেখায়',
    tagline:        'ট্যাগলাইন — লোগোর নিচে ও নেভিগেশনে দেখায়',
    bio:            'জীবনী অনুচ্ছেদ — "আমার সম্পর্কে" সেকশনে দেখায়',
    specialization: 'বিশেষায়ন — "আমার সম্পর্কে" তথ্য কার্ডে দেখায়',
    languages:      'ভাষা — "আমার সম্পর্কে" তথ্য কার্ডে দেখায়',
  },
  quote: {
    arabic: 'আরবি উক্তি',
    bangla: 'বাংলা অনুবাদ',
    source: 'সূত্র/রেফারেন্স',
  },
  organization: {
    heading: 'শিরোনাম',
    text:    'বর্ণনা (২-৩ লাইন) — দায়িত্ব সেকশনের পরে দেখায়',
    link:    'ওয়েবসাইট লিংক (ঐচ্ছিক — খালি রাখলে বাটন দেখাবে না)',
  },
  footerDua: {
    arabic:        'আরবি দোয়া',
    transliterate: 'উচ্চারণ (বাংলায়)',
    translation:   'বাংলা অর্থ',
  },
}

function ObjectEditor({ sectionKey, version, value, onChange, editingField, setEditingField }) {
  if (!value) return null
  const entries = Object.entries(value)

  function setField(field, newVal) {
    onChange({ ...value, [field]: newVal })
  }

  return (
    <div className="space-y-4 bg-white rounded-lg p-4 sm:p-5 shadow-sm">
      {entries.map(([field, val]) => {
        if (sectionKey === 'contactInfo' && CONTACT_FIELD_META[field]) {
          const meta = CONTACT_FIELD_META[field]
          return (
            <div key={`${sectionKey}-${field}-${version}`}>
              <FieldInput
                fieldId={`${sectionKey}-${field}`}
                editingField={editingField}
                setEditingField={setEditingField}
                label={meta.label}
                value={val}
                onChange={(v) => setField(field, v)}
              />
              {meta.hint && <p className="text-[.7rem] text-slate-400 mt-1">{meta.hint}</p>}
            </div>
          )
        }
        if (sectionKey === 'personalInfo' && field === 'profileImage') {
          return (
            <ImageUploadField
              key={`${sectionKey}-${field}-${version}`}
              value={val}
              onChange={(v) => setField(field, v)}
            />
          )
        }
        if (sectionKey === 'personalInfo' && field === 'cvUrl') {
          return (
            <PdfUploadField
              key={`${sectionKey}-${field}-${version}`}
              value={val}
              onChange={(v) => setField(field, v)}
            />
          )
        }
        return (
          <FieldInput
            key={`${sectionKey}-${field}-${version}`}
            fieldId={`${sectionKey}-${field}`}
            editingField={editingField}
            setEditingField={setEditingField}
            label={OBJECT_FIELD_LABELS[sectionKey]?.[field] || field}
            value={val}
            onChange={(v) => setField(field, v)}
          />
        )
      })}
    </div>
  )
}

// ── প্রোফাইল ছবি আপলোড (হিরো সেকশন + ন্যাভবার লোগো — দুই জায়গায়ই এই ছবি দেখায়) ─
function ImageUploadField({ value, onChange }) {
  const toast = useToast()
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('অনুগ্রহ করে একটা ছবি ফাইল নির্বাচন করুন (jpg/png/webp)।')
      return
    }
    setUploading(true)
    try {
      const ext = file.name.split('.').pop() || 'jpg'
      const url = await uploadAsset(file, `profile.${ext}`)
      onChange(url)
      toast.success('ছবি আপলোড হয়েছে — এখন নিচে "আপডেট করুন" চাপুন সেভ করতে')
    } catch (err) {
      toast.error('ছবি আপলোড করতে সমস্যা হয়েছে: ' + err.message)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <label className="block text-xs text-slate-500 mb-2">প্রোফাইল ছবি (হিরো সেকশন ও ন্যাভবার লোগো)</label>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0">
          {value
            ? <img src={value} alt="প্রোফাইল" className="w-full h-full object-cover" />
            : <ImageIcon size={20} className="text-slate-300" />
          }
        </div>
        <div className="flex-1">
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" id="profile-image-input" />
          <label
            htmlFor="profile-image-input"
            className={`inline-flex items-center gap-2 text-sm font-medium rounded-md px-4 py-2 cursor-pointer transition-colors ${
              uploading ? 'bg-slate-100 text-slate-400' : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />}
            {uploading ? 'আপলোড হচ্ছে...' : 'নতুন ছবি আপলোড করুন'}
          </label>
          <p className="text-[.7rem] text-slate-400 mt-1.5">JPG, PNG বা WebP</p>
        </div>
      </div>
    </div>
  )
}

// ── CV / জীবনবৃত্তান্ত PDF আপলোড ────────────────────────────
function PdfUploadField({ value, onChange }) {
  const toast = useToast()
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      toast.error('অনুগ্রহ করে একটা PDF ফাইল নির্বাচন করুন।')
      return
    }
    setUploading(true)
    try {
      const url = await uploadAsset(file, 'cv.pdf')
      onChange(url)
      toast.success('CV আপলোড হয়েছে — এখন নিচে "আপডেট করুন" চাপুন সেভ করতে')
    } catch (err) {
      toast.error('CV আপলোড করতে সমস্যা হয়েছে: ' + err.message)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <label className="block text-xs text-slate-500 mb-2">CV / জীবনবৃত্তান্ত (PDF)</label>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0">
          <FileText size={22} className={value ? 'text-red-500' : 'text-slate-300'} />
        </div>
        <div className="flex-1">
          <input ref={inputRef} type="file" accept="application/pdf" onChange={handleFile} className="hidden" id="cv-pdf-input" />
          <label
            htmlFor="cv-pdf-input"
            className={`inline-flex items-center gap-2 text-sm font-medium rounded-md px-4 py-2 cursor-pointer transition-colors ${
              uploading ? 'bg-slate-100 text-slate-400' : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />}
            {uploading ? 'আপলোড হচ্ছে...' : 'নতুন CV আপলোড করুন'}
          </label>
          {value && (
            <a href={value} target="_blank" rel="noreferrer" className="block text-[.75rem] text-green-700 hover:underline mt-1.5 truncate max-w-xs">
              বর্তমান CV দেখুন →
            </a>
          )}
          <p className="text-[.7rem] text-slate-400 mt-1">শুধু PDF ফাইল </p>
        </div>
      </div>
    </div>
  )
}

// অ্যারে-আইটেমের কিছু ইংরেজি ফিল্ড-কী-এর জন্য বাংলা লেবেল
const ARRAY_FIELD_LABELS = {
  socialLinks: { label: 'নাম', href: 'লিংক' },
  educations: { year: 'সাল', degree: 'ডিগ্রি / সনদ', inst: 'প্রতিষ্ঠানের নাম', badge: 'ব্যাজ (ঐচ্ছিক)', category: 'ক্যাটাগরি', grade: 'গ্রেড', point: 'পয়েন্ট (ঐচ্ছিক)' },
  roles: { icon: 'আইকন (ইমোজি)', title: 'শিরোনাম', desc: 'বিবরণ' },
  writings: { type: 'ধরন', title: 'শিরোনাম', sub: 'উপশিরোনাম', icon: 'আইকন (ইমোজি)', gold: 'বিশেষ (গোল্ড রঙ)', href: 'লিংক' },
  stats: { val: 'সংখ্যা', suf: 'প্রত্যয় (যেমন +)', label: 'লেবেল', icon: 'আইকন (ইমোজি)' },
}

const EDUCATION_CATEGORIES = [
  { value: 'madrasha', label: 'মাদরাসা শিক্ষা' },
  { value: 'general',  label: 'সাধারণ শিক্ষা' },
]

// ক্যাটাগরি অনুযায়ী গ্রেড অপশন
const EDUCATION_GRADES = {
  madrasha: ['মুমতাজ', 'জায়্যিদ জিদ্দান', 'জায়্যিদ', 'মাকবুল'],
  general:  ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'],
}

function CategorySelect({ value, onChange }) {
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1">ক্যাটাগরি</label>
      <select
        value={value || 'madrasha'}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {EDUCATION_CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>
    </div>
  )
}

function GradeSelect({ category, value, onChange }) {
  const options = EDUCATION_GRADES[category || 'madrasha'] || EDUCATION_GRADES.madrasha
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1">গ্রেড</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">— নির্বাচন করুন —</option>
        {options.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>
    </div>
  )
}

// ── অ্যারে (লিস্ট অফ অবজেক্ট/স্ট্রিং) এডিটর ─────────────────
function ArrayEditor({ sectionKey, version, value, onChange, editingField, setEditingField }) {
  if (!Array.isArray(value)) return null

  function updateItem(idx, newItem) {
    const copy = [...value]
    copy[idx] = newItem
    onChange(copy)
  }

  function removeItem(idx) {
    onChange(value.filter((_, i) => i !== idx))
  }

  function addItem() {
    const template = value.length > 0 ? value[0] : { label: '', href: '' }
    const blank =
      typeof template === 'object'
        ? Object.fromEntries(Object.keys(template).map((k) => [k, typeof template[k] === 'number' ? 0 : '']))
        : ''
    onChange([...value, blank])
  }

  return (
    <div className="space-y-4">
      {value.map((item, idx) => (
        <div key={idx} className="bg-white rounded-lg p-4 sm:p-5 shadow-sm relative">
          <button
            onClick={() => removeItem(idx)}
            className="absolute top-3 right-3 text-xs text-red-600 hover:underline"
          >
            মুছুন
          </button>
          {typeof item === 'object' ? (
            <div className="space-y-3 pr-14">
              {Object.entries(item).map(([field, val]) => {
                if (sectionKey === 'educations' && field === 'category') {
                  return (
                    <CategorySelect
                      key={`${sectionKey}-${idx}-${field}-${version}`}
                      value={val}
                      onChange={(v) => updateItem(idx, { ...item, [field]: v })}
                    />
                  )
                }
                if (sectionKey === 'educations' && field === 'grade') {
                  return (
                    <GradeSelect
                      key={`${sectionKey}-${idx}-${field}-${version}`}
                      category={item.category}
                      value={val}
                      onChange={(v) => updateItem(idx, { ...item, [field]: v })}
                    />
                  )
                }
                return (
                  <FieldInput
                    key={`${sectionKey}-${idx}-${field}-${version}`}
                    fieldId={`${sectionKey}-${idx}-${field}`}
                    editingField={editingField}
                    setEditingField={setEditingField}
                    label={ARRAY_FIELD_LABELS[sectionKey]?.[field] || field}
                    value={val}
                    onChange={(v) => updateItem(idx, { ...item, [field]: v })}
                  />
                )
              })}
            </div>
          ) : (
            <div className="pr-14">
              <FieldInput
                key={`${sectionKey}-${idx}-${version}`}
                fieldId={`${sectionKey}-${idx}`}
                editingField={editingField}
                setEditingField={setEditingField}
                label={`আইটেম ${idx + 1}`}
                value={item}
                onChange={(v) => updateItem(idx, v)}
              />
            </div>
          )}
        </div>
      ))}
      <button
        onClick={addItem}
        className="text-sm text-green-700 border border-green-600 rounded-md px-4 py-2 hover:bg-green-50"
      >
        + নতুন আইটেম যুক্ত করুন
      </button>
    </div>
  )
}

function FieldInput({ fieldId, editingField, setEditingField, label, value, onChange }) {
  const editing = editingField === fieldId
  const toggleEditing = () => setEditingField(editing ? null : fieldId)

  const wrapperClass = 'relative group'
  const editButton = (
    <button
      type="button"
      onClick={toggleEditing}
      className={`absolute right-2 top-[26px] p-1 rounded transition-colors ${
        editing ? 'text-green-600 bg-green-50' : 'text-slate-400 hover:text-green-600 hover:bg-slate-100'
      }`}
      title={editing ? 'এডিট শেষ করুন' : 'এডিট করুন'}
    >
      {editing ? <Check size={14} /> : <Pencil size={14} />}
    </button>
  )

  if (Array.isArray(value)) {
    return (
      <div className={wrapperClass}>
        <label className="block text-xs text-slate-500 mb-1">{label} (একাধিক লাইন, প্রতি লাইনে একটি)</label>
        <textarea
          rows={Math.max(2, value.length)}
          value={value.join('\n')}
          onChange={(e) => onChange(e.target.value.split('\n'))}
          readOnly={!editing}
          className={`w-full border rounded-md px-3 py-2 pr-9 text-sm focus:outline-none ${
            editing
              ? 'border-slate-300 focus:ring-2 focus:ring-green-500 bg-white'
              : 'border-slate-200 bg-slate-50 text-slate-500 cursor-default'
          }`}
        />
        {editButton}
      </div>
    )
  }

  if (typeof value === 'boolean') {
    return (
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={value}
          disabled={!editing}
          onChange={(e) => onChange(e.target.checked)}
        />
        {label}
        <button
          type="button"
          onClick={toggleEditing}
          className={`p-1 rounded ${editing ? 'text-green-600 bg-green-50' : 'text-slate-400 hover:text-green-600'}`}
          title={editing ? 'এডিট শেষ করুন' : 'এডিট করুন'}
        >
          {editing ? <Check size={14} /> : <Pencil size={14} />}
        </button>
      </label>
    )
  }

  if (typeof value === 'number') {
    return (
      <div className={wrapperClass}>
        <label className="block text-xs text-slate-500 mb-1">{label}</label>
        <input
          type="number"
          value={value}
          readOnly={!editing}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full border rounded-md px-3 py-2 pr-9 text-sm focus:outline-none ${
            editing
              ? 'border-slate-300 focus:ring-2 focus:ring-green-500 bg-white'
              : 'border-slate-200 bg-slate-50 text-slate-500 cursor-default'
          }`}
        />
        {editButton}
      </div>
    )
  }

  const isLong = typeof value === 'string' && value.length > 70
  return (
    <div className={wrapperClass}>
      <label className="block text-xs text-slate-500 mb-1">{label}</label>
      {isLong ? (
        <textarea
          rows={3}
          value={value}
          readOnly={!editing}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full border rounded-md px-3 py-2 pr-9 text-sm focus:outline-none ${
            editing
              ? 'border-slate-300 focus:ring-2 focus:ring-green-500 bg-white'
              : 'border-slate-200 bg-slate-50 text-slate-500 cursor-default'
          }`}
        />
      ) : (
        <input
          type="text"
          value={value ?? ''}
          readOnly={!editing}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full border rounded-md px-3 py-2 pr-9 text-sm focus:outline-none ${
            editing
              ? 'border-slate-300 focus:ring-2 focus:ring-green-500 bg-white'
              : 'border-slate-200 bg-slate-50 text-slate-500 cursor-default'
          }`}
        />
      )}
      {editButton}
    </div>
  )
}

// ── পাসওয়ার্ড পরিবর্তন (লগইন করা অবস্থায়) ───────────────────
// প্রফেশনাল সিস্টেম: আগে বর্তমান পাসওয়ার্ড যাচাই করা হয়, তারপর নতুন
// পাসওয়ার্ডের জন্য ন্যূনতম শক্তি (দৈর্ঘ্য + অক্ষর + সংখ্যা) বাধ্যতামূলক করা হয়
function passwordStrength(pw) {
  if (!pw) return { score: 0, label: '', color: 'bg-slate-200' }
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const levels = [
    { label: 'দুর্বল',       color: 'bg-red-500' },
    { label: 'দুর্বল',       color: 'bg-red-500' },
    { label: 'মোটামুটি',     color: 'bg-yellow-500' },
    { label: 'ভালো',        color: 'bg-green-500' },
    { label: 'শক্তিশালী',    color: 'bg-green-600' },
    { label: 'শক্তিশালী',    color: 'bg-green-600' },
  ]
  return { score, ...levels[score] }
}

function PasswordField({ label, value, onChange, show, onToggleShow, autoComplete, hint, error }) {
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className={`w-full border rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2
            ${error ? 'border-red-400 focus:ring-red-400' : 'border-slate-300 focus:ring-green-500'}`}
        />
        <button
          type="button"
          onClick={onToggleShow}
          tabIndex={-1}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error ? (
        <p className="text-[.72rem] text-red-500 mt-1">{error}</p>
      ) : hint ? (
        <p className="text-[.72rem] text-slate-400 mt-1">{hint}</p>
      ) : null}
    </div>
  )
}

function ChangePasswordForm() {
  const toast = useToast()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [saving, setSaving] = useState(false)

  const strength = passwordStrength(newPassword)
  const meetsLength = newPassword.length >= 8
  const meetsLetter = /[a-z]/i.test(newPassword)
  const meetsNumber = /\d/.test(newPassword)
  const isStrongEnough = meetsLength && meetsLetter && meetsNumber
  const confirmError = confirmPassword && confirmPassword !== newPassword ? 'দুইটা পাসওয়ার্ড মিলছে না' : ''
  const sameAsOldError = newPassword && currentPassword && newPassword === currentPassword
    ? 'নতুন পাসওয়ার্ড বর্তমান পাসওয়ার্ডের থেকে ভিন্ন হতে হবে' : ''

  const canSubmit = currentPassword.length > 0 && isStrongEnough && confirmPassword === newPassword && !sameAsOldError

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isStrongEnough) {
      toast.error('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে এবং অক্ষর ও সংখ্যা থাকতে হবে।')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('দুইটা পাসওয়ার্ড মিলছে না।')
      return
    }
    if (sameAsOldError) {
      toast.error(sameAsOldError)
      return
    }

    setSaving(true)

    // ধাপ ১: বর্তমান পাসওয়ার্ড সঠিক কিনা যাচাই — এটা ছাড়া কেউ সেশন খোলা
    // থাকা অবস্থায় (যেমন অন্য কারো কম্পিউটারে লগইন করা থাকলে) সরাসরি
    // পাসওয়ার্ড বদলে দিতে পারবে না
    const { data: userData } = await supabase.auth.getUser()
    const email = userData?.user?.email
    if (!email) {
      setSaving(false)
      toast.error('ব্যবহারকারীর তথ্য পাওয়া যায়নি, আবার লগইন করুন।')
      return
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({ email, password: currentPassword })
    if (verifyError) {
      setSaving(false)
      toast.error('বর্তমান পাসওয়ার্ড সঠিক নয়।')
      return
    }

    // ধাপ ২: যাচাই সফল হলে তবেই নতুন পাসওয়ার্ড সেট হবে
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setSaving(false)
    if (error) {
      toast.error('পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে: ' + error.message)
      return
    }
    toast.success('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে ✓')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 sm:p-5 shadow-sm max-w-sm space-y-4">
      <PasswordField
        label="বর্তমান পাসওয়ার্ড"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        show={showCurrent}
        onToggleShow={() => setShowCurrent((v) => !v)}
        autoComplete="current-password"
        hint="নিরাপত্তার জন্য প্রথমে আপনার বর্তমান পাসওয়ার্ড দিন"
      />

      <div>
        <PasswordField
          label="নতুন পাসওয়ার্ড"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          show={showNew}
          onToggleShow={() => setShowNew((v) => !v)}
          autoComplete="new-password"
          error={sameAsOldError}
        />
        {newPassword && (
          <div className="mt-2">
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded-full ${i < strength.score ? strength.color : 'bg-slate-200'}`} />
              ))}
            </div>
            <p className="text-[.72rem] text-slate-400 mt-1">
              পাসওয়ার্ডের শক্তি: <span className="font-medium">{strength.label}</span>
            </p>
          </div>
        )}
        <ul className="mt-2 space-y-0.5 text-[.72rem]">
          <li className={meetsLength ? 'text-green-600' : 'text-slate-400'}>✓ কমপক্ষে ৮ অক্ষর</li>
          <li className={meetsLetter ? 'text-green-600' : 'text-slate-400'}>✓ অন্তত একটি অক্ষর</li>
          <li className={meetsNumber ? 'text-green-600' : 'text-slate-400'}>✓ অন্তত একটি সংখ্যা</li>
        </ul>
      </div>

      <PasswordField
        label="নতুন পাসওয়ার্ড আবার দিন"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        show={showNew}
        onToggleShow={() => setShowNew((v) => !v)}
        autoComplete="new-password"
        error={confirmError}
      />

      <button
        type="submit"
        disabled={saving || !canSubmit}
        className={`text-sm font-medium rounded-md px-5 py-2 w-full transition-colors ${
          canSubmit && !saving
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        {saving ? 'সেভ হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}
      </button>
    </form>
  )
}
