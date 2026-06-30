import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useToast } from './Toast'

export default function ResetPasswordForm({ onDone }) {
  const toast = useToast()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।')
      return
    }
    if (password !== confirmPassword) {
      setError('দুইটা পাসওয়ার্ড মিলছে না।')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setError('পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে: ' + error.message)
      toast.error('পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে: ' + error.message)
      return
    }
    toast.success('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে ✓')
    onDone()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-xl shadow p-8 space-y-4">
        <h1 className="text-xl font-bold text-slate-800 text-center mb-2">নতুন পাসওয়ার্ড সেট করুন</h1>

        <div>
          <label className="block text-sm text-slate-600 mb-1">নতুন পাসওয়ার্ড</label>
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
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">নতুন পাসওয়ার্ড আবার দিন</label>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium rounded-md py-2 text-sm disabled:opacity-60"
        >
          {loading ? 'সেভ হচ্ছে...' : 'পাসওয়ার্ড সেভ করুন'}
        </button>
      </form>
    </div>
  )
}
