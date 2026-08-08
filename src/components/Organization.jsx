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
        text-green-700 bg-green-500/7 border border-green-400/20 px-3 py-1 rounded-full mb-2.5">
        ✦ প্রতিষ্ঠান
      </div>
      <h2 className="font-['Tiro_Bangla'] text-slate-900 dark:text-slate-100 mb-2 leading-tight [text-wrap:balance]" style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)' }}>
        {organization.heading}
      </h2>
      <div className="h-0.5 w-10 bg-gradient-to-r from-green-400 to-transparent rounded mb-6" />
      <p className="text-slate-500 dark:text-slate-400 max-w-[560px] leading-loose mb-2" style={{ fontSize: 'clamp(.92rem,2.2vw,1rem)' }}>
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
    </section>
  )
}
