import { ExternalLink } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import { usePortfolioData } from '../data/PortfolioDataContext'

export default function Organization() {
  const { organization } = usePortfolioData()
  const ref = useReveal()
  const hasLink = (organization.link || '').trim() !== ''

  return (
    <section ref={ref} className="opacity-0 translate-y-7 transition-[opacity,transform] duration-[650ms] ease-[cubic-bezier(.22,1,.36,1)] py-14
      [&.visible]:opacity-100 [&.visible]:translate-y-0">
      <div className="inline-flex items-center gap-1.5 text-[.6rem] font-bold tracking-[.2em] uppercase
        text-green-700 mb-2.5">
        ✦ প্রতিষ্ঠান
      </div>
      <div className="relative overflow-hidden rounded-3xl text-center py-14 px-6 sm:px-12
        bg-white dark:bg-slate-900 border border-slate-900/7 dark:border-white/8
        shadow-[0_1px_6px_rgba(0,0,0,.04),0_4px_18px_rgba(0,0,0,.03)]">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />
        <h2 className="font-['Tiro_Bangla'] text-slate-900 dark:text-slate-100 mb-4 leading-tight [text-wrap:balance]" style={{ fontSize: 'clamp(1.5rem,4vw,2rem)' }}>
          {organization.heading}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-[560px] mx-auto leading-loose mb-2" style={{ fontSize: 'clamp(.92rem,2.2vw,1rem)' }}>
          {organization.text}
        </p>
        {hasLink && (
          <a href={organization.link} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
              text-white text-[.85rem] font-semibold px-6 py-2.5 rounded-full shadow-[0_6px_18px_rgba(34,197,94,.28)]
              transition-all duration-300 hover:-translate-y-0.5 no-underline">
            ওয়েবসাইট দেখুন <ExternalLink size={14} />
          </a>
        )}
      </div>
    </section>
  )
}
