import { useReveal } from '../hooks/useReveal'
import { usePortfolioData } from '../data/PortfolioDataContext'

export default function HikmahIt() {
  const { hikmahIt } = usePortfolioData()
  const ref = useReveal()
  return (
    <section ref={ref} className="opacity-0 translate-y-7 transition-[opacity,transform] duration-[650ms] ease-[cubic-bezier(.22,1,.36,1)] py-20
      [&.visible]:opacity-100 [&.visible]:translate-y-0">
      <div className="relative overflow-hidden rounded-3xl text-center py-14 px-6 sm:px-12
        bg-white dark:bg-slate-900 border border-slate-900/7 dark:border-white/8
        shadow-[0_1px_6px_rgba(0,0,0,.04),0_4px_18px_rgba(0,0,0,.03)]">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />
        <div className="inline-flex items-center gap-1.5 text-[.6rem] font-bold tracking-[.2em] uppercase
          text-green-700 bg-green-500/7 border border-green-400/20 px-3 py-1 rounded-full mb-4">
          ✦ প্রতিষ্ঠান
        </div>
        <h2 className="font-['Tiro_Bangla'] text-slate-900 dark:text-slate-100 mb-4 leading-tight" style={{ fontSize: 'clamp(1.5rem,4vw,2rem)' }}>
          {hikmahIt.heading}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-[560px] mx-auto leading-loose" style={{ fontSize: 'clamp(.92rem,2.2vw,1rem)' }}>
          {hikmahIt.text}
        </p>
      </div>
    </section>
  )
}
