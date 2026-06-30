import { useReveal } from '../hooks/useReveal'
import { usePortfolioData } from '../data/PortfolioDataContext'

export default function Quote() {
  const { quote } = usePortfolioData()
  const ref = useReveal()
  return (
    <section ref={ref} className="opacity-0 translate-y-7 transition-[opacity,transform] duration-[650ms] ease-[cubic-bezier(.22,1,.36,1)] pb-20
      [&.visible]:opacity-100 [&.visible]:translate-y-0">
      <div className="relative overflow-hidden rounded-3xl text-center py-16 px-6 sm:px-12
        bg-gradient-to-br from-green-50 to-green-100 border border-green-400/18">
        {/* Corner ornaments */}
        <div className="absolute top-3 left-3 w-5 h-5 border-t-[1.5px] border-l-[1.5px] border-green-400/30 rounded-tl-[4px]" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t-[1.5px] border-r-[1.5px] border-green-400/30 rounded-tr-[4px]" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b-[1.5px] border-l-[1.5px] border-green-400/30 rounded-bl-[4px]" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b-[1.5px] border-r-[1.5px] border-green-400/30 rounded-br-[4px]" />
        <div className="absolute inset-0 pointer-events-none opacity-40"
          style={{ backgroundImage:`linear-gradient(rgba(34,197,94,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,.04) 1px, transparent 1px)`, backgroundSize:'48px 48px' }} />
        <div className="relative z-10">
          <div className="font-serif text-[4rem] leading-none text-green-400/18 mb-1.5">"</div>
          <p dir="rtl" className="font-['Amiri'] text-slate-900 mb-3 leading-relaxed"
            style={{ fontSize: 'clamp(1.4rem,4vw,1.8rem)' }}>
            {quote.arabic}
          </p>
          <p className="font-['Tiro_Bangla'] text-slate-600 max-w-[440px] mx-auto mb-3 leading-loose"
            style={{ fontSize: 'clamp(.95rem,2.5vw,1.1rem)' }}>
            {quote.bangla}
          </p>
          <div className="text-[.82rem] text-green-700 tracking-[.04em]">{quote.source}</div>
        </div>
      </div>
    </section>
  )
}
