import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

// ব্রাউজার নিজে থেকে "ইনস্টল" প্রম্পট (beforeinstallprompt ইভেন্ট) ট্রিগার
// করলে সেটা ধরে রেখে একটা সুন্দর, দৃশ্যমান বাটন হিসেবে দেখায় — শুধু
// ব্রাউজারের নিজস্ব উপরের নোটিফিকেশনের উপর ভরসা না করে, যাতে ভিজিটর
// সহজেই বুঝতে পারে সাইটটা হোম স্ক্রিনে/অ্যাপ হিসেবে ইনস্টল করা যায়
export default function InstallApp() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [dismissed, setDismissed] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // ইতিমধ্যে অ্যাপ হিসেবে (স্ট্যান্ডঅ্যালোন মোডে) খোলা থাকলে বাটন দেখানোর দরকার নেই
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true
    if (isStandalone) setInstalled(true)

    const onBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    const onInstalled = () => {
      setInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (!deferredPrompt || dismissed || installed) return null

  async function handleInstall() {
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-white dark:bg-slate-900
      border border-slate-900/8 dark:border-white/10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,.15)]
      pl-4 pr-2 py-2.5 animate-[toast-in_.5s_ease]">
      <span className="text-[.82rem] font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
        📲 অ্যাপ হিসেবে ইনস্টল করুন
      </span>
      <button onClick={handleInstall}
        className="flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
          text-white text-[.78rem] font-semibold px-3.5 py-2 rounded-xl transition-all duration-200">
        <Download size={13} /> ইনস্টল
      </button>
      <button onClick={() => setDismissed(true)} aria-label="বন্ধ করুন"
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        <X size={14} />
      </button>
    </div>
  )
}
