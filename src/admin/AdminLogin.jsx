import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useToast } from './Toast'

// পাসওয়ার্ড রিসেট রিকোয়েস্ট রেট-লিমিট: একই ইমেইলে নির্দিষ্ট সময়ে সর্বোচ্চ কতবার পাঠানো যাবে
const RESET_LIMIT_COUNT = 3
const RESET_LIMIT_WINDOW_MS = 15 * 60 * 1000 // ১৫ মিনিট
const RESET_LIMIT_KEY = 'admin_reset_attempts'

function checkResetRateLimit(email) {
  const now = Date.now()
  let store = {}
  try {
    store = JSON.parse(localStorage.getItem(RESET_LIMIT_KEY) || '{}')
  } catch {
    store = {}
  }
  const key = email.trim().toLowerCase()
  const attempts = (store[key] || []).filter((t) => now - t < RESET_LIMIT_WINDOW_MS)

  if (attempts.length >= RESET_LIMIT_COUNT) {
    const oldestExpiry = attempts[0] + RESET_LIMIT_WINDOW_MS
    const minutesLeft = Math.max(1, Math.ceil((oldestExpiry - now) / 60000))
    return { allowed: false, minutesLeft }
  }

  attempts.push(now)
  store[key] = attempts
  // পুরোনো এন্ট্রি জমে localStorage যেন না ভরে যায়
  Object.keys(store).forEach((k) => {
    store[k] = store[k].filter((t) => now - t < RESET_LIMIT_WINDOW_MS)
    if (store[k].length === 0) delete store[k]
  })
  localStorage.setItem(RESET_LIMIT_KEY, JSON.stringify(store))
  return { allowed: true }
}

export default function AdminLogin({ onLoggedIn }) {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('login') // 'login' | 'forgot'
  const [forgotStatus, setForgotStatus] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('লগইন ব্যর্থ — ইমেইল বা পাসওয়ার্ড ভুল।')
      toast.error('লগইন ব্যর্থ — ইমেইল বা পাসওয়ার্ড ভুল।')
      return
    }
    toast.success('সফলভাবে লগইন হয়েছে ✓')
    onLoggedIn(data.session)
  }

  async function handleForgotSubmit(e) {
    e.preventDefault()
    setForgotStatus('')

    const limit = checkResetRateLimit(email)
    if (!limit.allowed) {
      const msg = `আপনি অনেকবার রিসেট লিংক চেয়েছেন। অনুগ্রহ করে ${limit.minutesLeft} মিনিট পর আবার চেষ্টা করুন।`
      setForgotStatus(msg)
      toast.error(msg)
      return
    }

    setForgotLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin`,
    })
    setForgotLoading(false)
    if (error) {
      const msg = 'ইমেইল পাঠাতে সমস্যা হয়েছে: ' + error.message
      setForgotStatus(msg)
      toast.error(msg)
    } else {
      const msg = 'পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে। ইমেইল চেক করুন।'
      setForgotStatus(msg)
      toast.success(msg)
    }
  }

  if (mode === 'forgot') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <form onSubmit={handleForgotSubmit} className="w-full max-w-sm bg-white rounded-xl shadow p-8 space-y-4">
          <h1 className="text-xl font-bold text-slate-800 text-center mb-2">পাসওয়ার্ড রিসেট</h1>
          <p className="text-sm text-slate-500 text-center -mt-2">
            আপনার এডমিন ইমেইল দিন, আমরা একটা রিসেট লিংক পাঠাবো।
          </p>

          <div>
            <label className="block text-sm text-slate-600 mb-1">ইমেইল</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {forgotStatus && (
            <p className={`text-sm ${forgotStatus.includes('সমস্যা') ? 'text-red-600' : 'text-green-700'}`}>
              {forgotStatus}
            </p>
          )}

          <button
            type="submit"
            disabled={forgotLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium rounded-md py-2 text-sm disabled:opacity-60"
          >
            {forgotLoading ? 'পাঠানো হচ্ছে...' : 'রিসেট লিংক পাঠান'}
          </button>

          <button
            type="button"
            onClick={() => { setMode('login'); setForgotStatus('') }}
            className="w-full text-sm text-slate-500 hover:text-slate-700 text-center"
          >
            ← লগইনে ফিরে যান
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-xl shadow p-8 space-y-4">
        <h1 className="text-xl font-bold text-slate-800 text-center mb-2">এডমিন প্যানেল লগইন</h1>

        <div>
          <label className="block text-sm text-slate-600 mb-1">ইমেইল</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">পাসওয়ার্ড</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখান'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end -mt-1">
          <button
            type="button"
            onClick={() => { setMode('forgot'); setError('') }}
            className="text-xs text-green-700 hover:underline"
          >
            পাসওয়ার্ড ভুলে গেছেন?
          </button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium rounded-md py-2 text-sm disabled:opacity-60"
        >
          {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
        </button>
      </form>
    </div>
  )
}
