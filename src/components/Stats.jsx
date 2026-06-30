import { useEffect, useRef, useState } from 'react'
import { usePortfolioData } from '../data/PortfolioDataContext'

export default function Stats() {
  const { stats } = usePortfolioData()
  const [counts, setCounts] = useState(stats.map(() => 0))
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        setStarted(true)
        stats.forEach((s, i) => {
          let v = 0
          const step = Math.max(1, Math.ceil(s.val / 90))
          const t = setInterval(() => {
            v = Math.min(v + step, s.val)
            setCounts(p => { const n = [...p]; n[i] = v; return n })
            if (v >= s.val) clearInterval(t)
          }, 18)
        })
      }
    }, { threshold: .3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [started])

  return (
    <div ref={ref} className="bg-gradient-to-br from-green-50 to-slate-50 border-t border-green-500/10 border-b border-green-500/8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="text-center py-6 px-3.5 rounded-2xl bg-white border border-green-500/10
            relative overflow-hidden transition-all duration-300
            before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2
            before:w-[40%] before:h-0.5 before:bg-gradient-to-r before:from-transparent before:via-green-400 before:to-transparent
            hover:border-green-400/28 hover:shadow-[0_8px_28px_rgba(34,197,94,.1)] hover:-translate-y-1 group">
            <div className="text-2xl mb-1.5">{s.icon}</div>
            <div className="font-['Tiro_Bangla'] text-green-700 font-bold leading-none"
              style={{ fontSize: 'clamp(1.9rem,4vw,2.5rem)' }}>
              {counts[i].toLocaleString('bn')}{s.suf}
            </div>
            <div className="text-[.8rem] text-slate-500 mt-1">{s.label}</div>
            <div className="h-0.5 w-7 bg-green-500/18 rounded mx-auto mt-2 transition-all duration-400 group-hover:w-12 group-hover:bg-green-400" />
          </div>
        ))}
      </div>
    </div>
  )
}
