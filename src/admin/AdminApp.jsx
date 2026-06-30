import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import AdminLogin from './AdminLogin'
import AdminPanel from './AdminPanel'

export default function AdminApp() {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) { setChecking(false); return }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md text-center bg-white rounded-xl shadow p-8">
          <h1 className="text-xl font-bold text-slate-800 mb-2">Supabase কনফিগার করা হয়নি</h1>
          <p className="text-slate-600 text-sm">
            .env ফাইলে VITE_SUPABASE_URL এবং VITE_SUPABASE_ANON_KEY যুক্ত করে আবার বিল্ড/রান করুন।
          </p>
        </div>
      </div>
    )
  }

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">লোড হচ্ছে...</div>
  }

  if (!session) {
    return <AdminLogin onLoggedIn={setSession} />
  }

  return <AdminPanel onLogout={() => supabase.auth.signOut()} />
}
