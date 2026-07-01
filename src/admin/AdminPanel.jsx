import { useEffect, useState, useRef } from 'react'
import {
  Eye, EyeOff, Pencil, Check, LogOut, LayoutDashboard,
  User, Phone, Share2, Menu, BarChart3, GraduationCap,
  Briefcase, BookOpen, Quote as QuoteIcon, MoonStar, KeyRound,
  Image as ImageIcon, FileText, UploadCloud, Loader2,
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
  { key: 'writings', label: 'লেখালেখি / বই', type: 'array' },
  { key: 'quote', label: 'অনুপ্রেরণামূলক উক্তি', type: 'object' },
  { key: 'footerDua', label: 'ফুটারের আরবি দোয়া', type: 'object' },
  { key: 'account', label: 'পাসওয়ার্ড পরিবর্তন', type: 'account' },
]

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
    SECTIONS.forEach(({ key, type }) => {
      const row = !error && data ? data.find((r) => r.section_key === key) : null
      const saved = row ? row.content : null
      const base = defaults[key]

      if (saved && type === 'object' && base && typeof base === 'object' && !Array.isArray(base)) {
        // পুরনো সেভ করা ডেটায় নতুন যুক্ত হওয়া ফিল্ড (যেমন cvUrl) না থাকলে
        // ডিফল্ট থেকে সেটা যুক্ত করে দেয়, যাতে সেটা এডমিন প্যানেলে দেখা যায়
        merged[key] = { ...base, ...saved }
      } else {
        merged[key] = saved || base
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

  const activeSection = SECTIONS.find((s) => s.key === activeKey)
  const isDirty = JSON.stringify(content[activeKey]) !== JSON.stringify(original[activeKey])

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
              <h2 className="text-lg font-semibold text-slate-800 mb-4">{activeSection.label}</h2>

              {activeSection.type === 'account' ? (
                <ChangePasswordForm />
              ) : (
                <>
                  {activeSection.type === 'object' ? (
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

                  <div className="mt-6 flex items-center gap-3">
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
                    {!isDirty && !saving && (
                      <span className="text-xs text-slate-400">কোনো পরিবর্তন করা হয়নি</span>
                    )}
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  )
}

// ── অবজেক্ট (key: value) এডিটর ───────────────────────────────
function ObjectEditor({ sectionKey, version, value, onChange, editingField, setEditingField }) {
  if (!value) return null
  const entries = Object.entries(value)

  function setField(field, newVal) {
    onChange({ ...value, [field]: newVal })
  }

  return (
    <div className="space-y-4 bg-white rounded-lg p-4 sm:p-5 shadow-sm">
      {entries.map(([field, val]) => {
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
            label={field}
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
              {Object.entries(item).map(([field, val]) => (
                <FieldInput
                  key={`${sectionKey}-${idx}-${field}-${version}`}
                  fieldId={`${sectionKey}-${idx}-${field}`}
                  editingField={editingField}
                  setEditingField={setEditingField}
                  label={field}
                  value={val}
                  onChange={(v) => updateItem(idx, { ...item, [field]: v })}
                />
              ))}
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
function ChangePasswordForm() {
  const toast = useToast()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (newPassword.length < 6) {
      toast.error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('দুইটা পাসওয়ার্ড মিলছে না।')
      return
    }
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setSaving(false)
    if (error) {
      toast.error('পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে: ' + error.message)
      return
    }
    toast.success('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে ✓')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 sm:p-5 shadow-sm max-w-sm space-y-4">
      <div>
        <label className="block text-xs text-slate-500 mb-1">নতুন পাসওয়ার্ড</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">নতুন পাসওয়ার্ড আবার দিন</label>
        <input
          type={showPassword ? 'text' : 'password'}
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md px-5 py-2 disabled:opacity-60"
      >
        {saving ? 'সেভ হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}
      </button>
    </form>
  )
}
