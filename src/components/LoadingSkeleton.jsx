// ============================================================
//  LoadingSkeleton.jsx — Supabase থেকে ডেটা লোড হওয়ার সময় দেখানো হয়,
//  যাতে ডেমো/প্লেসহোল্ডার তথ্য কখনো চোখে না পড়ে। ডেটা রেডি হওয়া
//  মাত্র এটা সরে গিয়ে আসল কন্টেন্ট দেখাবে।
// ============================================================

function Bar({ className = '' }) {
  return <div className={`rounded-md bg-slate-200/80 animate-pulse ${className}`} />
}

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-[36px] h-[36px] rounded-[10px] bg-green-500/10 animate-pulse" />
            <div className="space-y-1.5">
              <Bar className="h-3 w-28" />
              <Bar className="h-2 w-16" />
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Bar className="h-3 w-12" />
            <Bar className="h-3 w-14" />
            <Bar className="h-3 w-12" />
            <Bar className="h-3 w-14" />
            <div className="h-9 w-24 rounded-full bg-green-500/15 animate-pulse" />
          </div>
        </div>
      </header>
      <div className="h-12 md:h-[58px]" />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            <div className="w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] rounded-full bg-green-500/8 animate-pulse" />
          </div>
          <div className="flex flex-col gap-4">
            <Bar className="h-9 w-3/4" />
            <div className="flex gap-2">
              <Bar className="h-6 w-20 rounded-full" />
              <Bar className="h-6 w-24 rounded-full" />
              <Bar className="h-6 w-20 rounded-full" />
            </div>
            <div className="space-y-2.5 mt-2">
              <Bar className="h-4 w-48" />
              <Bar className="h-4 w-40" />
              <Bar className="h-4 w-56" />
            </div>
            <div className="flex gap-3 mt-3">
              <div className="h-11 w-11 rounded-full bg-green-500/10 animate-pulse" />
              <div className="h-11 w-11 rounded-full bg-green-500/10 animate-pulse" />
            </div>
            <div className="flex gap-3 mt-2">
              <Bar className="h-11 w-36 rounded-full" />
              <Bar className="h-11 w-36 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="bg-gradient-to-br from-green-50 to-slate-50 border-t border-b border-green-500/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center py-6 px-3.5 rounded-2xl bg-white border border-green-500/10">
              <Bar className="h-6 w-6 mx-auto mb-3 rounded-full" />
              <Bar className="h-7 w-14 mx-auto mb-2" />
              <Bar className="h-3 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Generic content sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {Array.from({ length: 3 }).map((_, s) => (
          <section key={s} className="py-16">
            <Bar className="h-4 w-28 mb-4 rounded-full" />
            <Bar className="h-8 w-56 mb-8" />
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white border border-slate-900/7 rounded-2xl p-6 space-y-3">
                  <Bar className="h-8 w-8 rounded-lg" />
                  <Bar className="h-4 w-3/4" />
                  <Bar className="h-3 w-full" />
                  <Bar className="h-3 w-5/6" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-b from-green-50 to-green-100 py-14">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-3">
          <Bar className="h-4 w-40" />
          <Bar className="h-3 w-32" />
          <div className="flex gap-3 mt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 w-10 rounded-full bg-white/70 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
