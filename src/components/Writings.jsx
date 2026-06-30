import { useReveal } from '../hooks/useReveal'
import { usePortfolioData } from '../data/PortfolioDataContext'

export default function Writings() {
  const { writings } = usePortfolioData()
  const ref = useReveal()
  return (
    <section id="lekhalekhi" ref={ref} className="opacity-0 translate-y-7 transition-[opacity,transform] duration-[650ms] ease-[cubic-bezier(.22,1,.36,1)] py-20
      [&.visible]:opacity-100 [&.visible]:translate-y-0">
      <div className="inline-flex items-center gap-1.5 text-[.6rem] font-bold tracking-[.2em] uppercase
        text-green-700 bg-green-500/7 border border-green-400/20 px-3 py-1 rounded-full mb-2.5">
        ✦ লেখালেখি
      </div>
      <h2 className="font-['Tiro_Bangla'] text-slate-900 mb-2 leading-tight" style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)' }}>
        প্রকাশিত বই ও লেখা
      </h2>
      <div className="h-0.5 w-10 bg-gradient-to-r from-green-400 to-transparent rounded mb-9" />

      <div className="flex flex-col gap-3">
        {writings.map((w, i) => (
          <a key={i} href={w.href || '#'}
            className="flex items-center gap-3.5 px-4 py-4 border border-slate-900/7 rounded-[13px]
              bg-white no-underline text-inherit transition-all duration-300
              hover:border-green-400/22 hover:bg-green-500/2 hover:translate-x-1.5 hover:shadow-[0_4px_18px_rgba(34,197,94,.07)]">
            <span className="text-2xl flex-shrink-0">{w.icon}</span>
            <span className={`text-[.7rem] font-bold tracking-[.12em] uppercase flex-shrink-0 w-[70px] ${w.gold ? 'text-yellow-500' : 'text-green-500'}`}>
              {w.type}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-['Tiro_Bangla'] text-[1.05rem] text-slate-900 mb-0.5">{w.title}</div>
              <div className="text-[.8rem] text-slate-400">{w.sub}</div>
            </div>
            <svg width="16" height="16" fill="none" stroke="rgba(201,168,76,.4)" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0">
              <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
            </svg>
          </a>
        ))}
      </div>
    </section>
  )
}
