import { useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { supabase } from '../lib/supabase'
import * as defaults from '../data/demoData'

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
  const [activeKey, setActiveKey] = useState(SECTIONS[0].key)
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')

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
    setLoading(false)
  }

  function updateField(sectionKey, value) {
    setContent((prev) => ({ ...prev, [sectionKey]: value }))
  }

  async function saveSection(sectionKey) {
    setSaving(true)
    setStatus('')
    const { error } = await supabase
      .from(TABLE)
      .upsert({ section_key: sectionKey, content: content[sectionKey] }, { onConflict: 'section_key' })
    setSaving(false)
    setStatus(error ? 'সেভ করতে সমস্যা হয়েছে: ' + error.message : 'সফলভাবে সেভ হয়েছে ✓')
  }

  const activeSection = SECTIONS.find((s) => s.key === activeKey)

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
                onClick={() => { setActiveKey(s.key); setStatus('') }}
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
                  <ObjectEditor value={content[activeKey]} onChange={(v) => updateField(activeKey, v)} />
                ) : (
                  <ArrayEditor value={content[activeKey]} onChange={(v) => updateField(activeKey, v)} />
                )}

                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => saveSection(activeKey)}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md px-5 py-2 disabled:opacity-60"
                  >
                    {saving ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                  </button>
                  {status && <span className="text-sm text-slate-600">{status}</span>}
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
function ObjectEditor({ value, onChange }) {
  if (!value) return null
  const entries = Object.entries(value)

  function setField(field, newVal) {
    onChange({ ...value, [field]: newVal })
  }

  return (
    <div className="space-y-4 bg-white rounded-lg p-4 sm:p-5 shadow-sm">
      {entries.map(([field, val]) => (
        <FieldInput key={field} label={field} value={val} onChange={(v) => setField(field, v)} />
      ))}
    </div>
  )
}

// ── অ্যারে (লিস্ট অফ অবজেক্ট/স্ট্রিং) এডিটর ─────────────────
function ArrayEditor({ value, onChange }) {
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
                  key={field}
                  label={field}
                  value={val}
                  onChange={(v) => updateItem(idx, { ...item, [field]: v })}
                />
              ))}
            </div>
          ) : (
            <div className="pr-14">
              <FieldInput label={`আইটেম ${idx + 1}`} value={item} onChange={(v) => updateItem(idx, v)} />
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

// ── একক ফিল্ড ইনপুট (টাইপ বুঝে text/textarea/number/checkbox) ─
function FieldInput({ label, value, onChange }) {
  if (Array.isArray(value)) {
    return (
      <div>
        <label className="block text-xs text-slate-500 mb-1">{label} (একাধিক লাইন, প্রতি লাইনে একটি)</label>
        <textarea
          rows={Math.max(2, value.length)}
          value={value.join('\n')}
          onChange={(e) => onChange(e.target.value.split('\n'))}
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    )
  }

  if (typeof value === 'boolean') {
    return (
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
        {label}
      </label>
    )
  }

  if (typeof value === 'number') {
    return (
      <div>
        <label className="block text-xs text-slate-500 mb-1">{label}</label>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    )
  }

  const isLong = typeof value === 'string' && value.length > 70
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1">{label}</label>
      {isLong ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      ) : (
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      )}
    </div>
  )
}

// ── পাসওয়ার্ড পরিবর্তন (লগইন করা অবস্থায়) ───────────────────
function ChangePasswordForm() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('')
    if (newPassword.length < 6) {
      setStatus('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।')
      return
    }
    if (newPassword !== confirmPassword) {
      setStatus('দুইটা পাসওয়ার্ড মিলছে না।')
      return
    }
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setSaving(false)
    if (error) {
      setStatus('পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে: ' + error.message)
      return
    }
    setStatus('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে ✓')
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

      {status && (
        <p className={`text-sm ${status.includes('✓') ? 'text-green-700' : 'text-red-600'}`}>{status}</p>
      )}

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
