import { useEffect, useState } from 'react'
import { Eye, EyeOff, Pencil, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import * as defaults from '../data/demoData'
import { useToast } from './Toast'

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

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    const { data, error } = await supabase.from(TABLE).select('section_key, content')
    const merged = {}
    SECTIONS.forEach(({ key }) => {
      const row = !error && data ? data.find((r) => r.section_key === key) : null
      merged[key] = row ? row.content : defaults[key]
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
  }

  const activeSection = SECTIONS.find((s) => s.key === activeKey)
  const isDirty = JSON.stringify(content[activeKey]) !== JSON.stringify(original[activeKey])

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between">
        <h1 className="font-bold text-slate-800">পোর্টফোলিও এডমিন প্যানেল</h1>
        <button onClick={onLogout} className="text-sm text-red-600 hover:underline">লগআউট</button>
      </header>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-500">লোড হচ্ছে...</div>
      ) : (
        <div className="flex-1 flex flex-col sm:flex-row">
          <nav className="sm:w-56 bg-white border-r border-slate-200 p-3 flex sm:flex-col gap-1 overflow-x-auto">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveKey(s.key)}
                className={`text-left text-sm rounded-md px-3 py-2 whitespace-nowrap ${
                  activeKey === s.key ? 'bg-green-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>

          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
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
                  />
                ) : (
                  <ArrayEditor
                    sectionKey={activeKey}
                    version={version}
                    value={content[activeKey]}
                    onChange={(v) => updateField(activeKey, v)}
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
          </main>
        </div>
      )}
    </div>
  )
}

// ── অবজেক্ট (key: value) এডিটর ───────────────────────────────
function ObjectEditor({ sectionKey, version, value, onChange }) {
  if (!value) return null
  const entries = Object.entries(value)

  function setField(field, newVal) {
    onChange({ ...value, [field]: newVal })
  }

  return (
    <div className="space-y-4 bg-white rounded-lg p-4 sm:p-5 shadow-sm">
      {entries.map(([field, val]) => (
        <FieldInput
          key={`${sectionKey}-${field}-${version}`}
          label={field}
          value={val}
          onChange={(v) => setField(field, v)}
        />
      ))}
    </div>
  )
}

// ── অ্যারে (লিস্ট অফ অবজেক্ট/স্ট্রিং) এডিটর ─────────────────
function ArrayEditor({ sectionKey, version, value, onChange }) {
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

// ── একক ফিল্ড ইনপুট — ডিফল্টে রিড-মোড, এডিট আইকনে ক্লিক করলে এডিটেবল হবে ─
function FieldInput({ label, value, onChange }) {
  const [editing, setEditing] = useState(false)

  const wrapperClass = 'relative group'
  const editButton = (
    <button
      type="button"
      onClick={() => setEditing((v) => !v)}
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
          onClick={() => setEditing((v) => !v)}
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
